import { GroupEntity, Id, MatchEntity, PositionsTable } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { UpdatePositionTableUsecase } from '../update-positions-table/update-positions-table.usecase';
import { Observable, of, zip } from 'rxjs';
import { GetGroupByIdUsecase } from '../groups/get-group-by-id/get-group-by-id.usecase';
import { GetGroupMatchesUsecase } from '../group-matches/get-group-matches/get-group-matches.usecase';
import { OrganizationContract } from '../../contracts/organization.contract';
import { DEFAULT_FIXTURE_STAGES_CONFIGURATION, FixtureStagesConfiguration } from '@deporty-org/entities/organizations';
import { map, mergeMap } from 'rxjs/operators';
import { UpdateGroupUsecase } from '../groups/update-group/update-group.usecase';
import { GetIntergroupMatchesByGroupIdUsecase } from '../intergroup-matches/get-intergroup-matches-by-group-id/get-intergroup-matches-by-group-id.usecase';
// import { GetIntergroupMatchesUsecase } from '../intergroup-matches/get-intergroup-matches/get-intergroup-match.usecase';

export interface Param {
  fixtureStageId: Id;
  groupId: Id;
  tournamentId: Id;
  organizationId: Id;
  tournamentLayoutId: Id;
}

export class CalculatePositionTableOfGroupUsecase extends Usecase<Param, PositionsTable> {
  constructor(
    private updatePositionTableUsecase: UpdatePositionTableUsecase,
    private getGroupByIdUsecase: GetGroupByIdUsecase,
    private organizationContract: OrganizationContract,
    private getGroupMatchesUsecase: GetGroupMatchesUsecase,
    private getIntergroupMatchesByGroupIdUsecase: GetIntergroupMatchesByGroupIdUsecase,
    // private getIntergroupMatchesUsecase: GetIntergroupMatchesUsecase,
    private updateGroupUsecase: UpdateGroupUsecase
  ) {
    super();
  }

  call(param: Param): Observable<PositionsTable> {
    return zip(
      this.organizationContract.getTournamentLayoutByIdUsecase(param.organizationId, param.tournamentLayoutId),

      this.getGroupByIdUsecase.call({
        fixtureStageId: param.fixtureStageId,
        tournamentId: param.tournamentId,
        groupId: param.groupId,
      }),
      this.getGroupMatchesUsecase.call({
        ...param,
        states: ['completed', 'in-review'],
      }),
      this.getIntergroupMatchesByGroupIdUsecase.call({
        ...param,
        states: ['completed', 'in-review'],
      })
    ).pipe(
      mergeMap(([tournamentLayout, group, groupMatches, intergroupMatches]) => {
        
        const matches = [...groupMatches, ...intergroupMatches.map((x) => ({...x.match, id: x.id}))];
        
        

        const config = tournamentLayout.fixtureStagesConfiguration || DEFAULT_FIXTURE_STAGES_CONFIGURATION;

        const meta = {
          tournamentId: param.tournamentId,
          fixtureStageId: param.fixtureStageId,
          groupId: param.groupId,
        };

        const intiPositionTable: PositionsTable = {
          analizedMatches: [],
          table: [],
        };

        let lastPositionTable = of(intiPositionTable);

        if (matches.length) {
          lastPositionTable = this.resolve(matches, 0, group.teamIds, intiPositionTable, config, meta);
        }
        return zip(lastPositionTable, of(group));
      }),
      mergeMap(([positionsTable, group]) => {
        const newGroup: GroupEntity = {
          ...group,
          positionsTable,
        };

        return this.updateGroupUsecase
          .call({
            fixtureStageId: param.fixtureStageId,
            group: newGroup,
            tournamentId: param.tournamentId,
          })
          .pipe(
            map(() => {
              return positionsTable;
            })
          );
      })
    );
  }

  resolve(
    matches: MatchEntity[],
    index: number,
    teamIds: Id[],
    positionsTable: PositionsTable,
    config: FixtureStagesConfiguration,
    meta: any
  ): Observable<PositionsTable> {
    const match = matches[index];
    return this.updatePositionTableUsecase
      .call({
        availableTeams: teamIds,
        match,
        positionsTable,
        tieBreakingOrder: config.tieBreakingOrder,
        negativePointsPerCard: config.negativePointsPerCard,
        pointsConfiguration: config.pointsConfiguration,
        meta,
      })
      .pipe(
        mergeMap((newPositionTable) => {
          if (index + 1 < matches.length) {
            return this.resolve(matches, index + 1, teamIds, newPositionTable, config, meta);
          }
          return of(newPositionTable);
        })
      );
  }
}
