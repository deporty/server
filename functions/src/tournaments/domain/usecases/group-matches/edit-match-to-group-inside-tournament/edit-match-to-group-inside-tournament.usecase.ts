import { Id } from '@deporty-org/entities';
import {
  GroupEntity,
  MatchEntity,
  PositionsTable,
} from '@deporty-org/entities/tournaments';
import { Observable, of, throwError, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { FileAdapter } from '../../../../../core/file/file.adapter';
import { convertToImage } from '../../../../../core/helpers';
import { Usecase } from '../../../../../core/usecase';
import { MatchContract } from '../../../contracts/match.contract';
import { GetMatchByIdUsecase } from '../get-match-by-id/get-match-by-id.usecase';
import { UpdatePositionTableUsecase } from '../../update-positions-table/update-positions-table.usecase';
import { GetGroupByIdUsecase } from '../../groups/get-group-by-id/get-group-by-id.usecase';
import { UpdateGroupUsecase } from '../../groups/update-group/update-group.usecase';
import { GetTournamentByIdUsecase } from '../../get-tournament-by-id/get-tournament-by-id.usecase';
import { DEFAULT_FIXTURE_STAGES_CONFIGURATION } from '@deporty-org/entities/organizations';
import { OrganizationContract } from '../../../contracts/organization.contract';

export class MatchIsCompletedError extends Error {
  constructor() {
    super();
    this.message = `The Match is completed`;
    this.name = 'MatchIsCompletedError';
  }
}

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
  match: MatchEntity;
}

export class EditMatchInsideGroupUsecase extends Usecase<
  Param,
  { match: MatchEntity; positionsTable: PositionsTable | undefined}
> {
  constructor(
    private matchContract: MatchContract,
    private fileAdapter: FileAdapter,
    private getMatchByIdUsecase: GetMatchByIdUsecase,
    private updatePositionTableUsecase: UpdatePositionTableUsecase,
    private getGroupByIdUsecase: GetGroupByIdUsecase,
    private updateGroupUsecase: UpdateGroupUsecase,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private organizationContract: OrganizationContract
  ) {
    super();
  }

  call(
    param: Param
  ): Observable<{ match: MatchEntity; positionsTable: PositionsTable | undefined }> {
    const $tournamentId = this.getTournamentByIdUsecase.call(
      param.tournamentId
    );
    const $match = this.getMatchByIdUsecase.call({
      fixtureStageId: param.fixtureStageId,
      groupId: param.groupId,
      matchId: param.match.id!,
      tournamentId: param.tournamentId,
    });

    return zip($match, $tournamentId).pipe(
      mergeMap(([prevMatch, tournament]) => {
        if (prevMatch.status !== 'completed') {
          const $tournamentLayout =
            this.organizationContract.getTournamentLayoutByIdUsecase(
              tournament.organizationId,
              tournament.tournamentLayoutId
            );

          const $group = this.getGroupByIdUsecase.call({
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
            tournamentId: param.tournamentId,
          });
          return zip(this.edit(param), $tournamentLayout, $group).pipe(
            mergeMap(([match, tournamentLayout, group]) => {

              const config = tournamentLayout.fixtureStagesConfiguration || DEFAULT_FIXTURE_STAGES_CONFIGURATION
              return zip(
                of(match),
                of(group),
                match.status === 'completed' ? this.updatePositionTableUsecase.call({
                  availableTeams: group.teamIds,
                  match,
                  positionsTable: group.positionsTable,
                  tieBreakingOrder: config.tieBreakingOrder,
                  negativePointsPerCard: config.negativePointsPerCard,
                  pointsConfiguration: config.pointsConfiguration,
                  meta: {
                    tournamentId: param.tournamentId,
                    fixtureStageId: param.fixtureStageId,
                    groupId: param.groupId,
                  }
                }) : of(group.positionsTable)
              );
            }),

            mergeMap(([match, group, positionsTable]) => {
              const newGroup: GroupEntity = {
                ...group,
                positionsTable,
              };

              return zip(
                of(match),
                of(positionsTable),
                this.updateGroupUsecase.call({
                  fixtureStageId: param.fixtureStageId,
                  group: newGroup,
                  tournamentId: param.tournamentId,
                })
              );
            }),
            map(([match, positionsTable, group]) => {
              return { match, positionsTable: positionsTable };
            })
          );
        }
        return throwError(new MatchIsCompletedError());
      })
    );
  }

  private edit(param: Param) {
    const prefixSignaturePath = `tournaments/${param.tournamentId}/stages/${param.fixtureStageId}/groups/${param.groupId}/matches/${param.match.id}`;
    const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
    const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
    const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;

    const signatures: Observable<string | undefined>[] = [
      convertToImage(
        param.match['captainASignature'],
        captainASignaturePath,
        this.fileAdapter
      ),
      convertToImage(
        param.match['captainBSignature'],
        captainBSignaturePath,
        this.fileAdapter
      ),
      convertToImage(
        param.match['judgeSignature'],
        judgeSignaturePath,
        this.fileAdapter
      ),
    ];
    return zip(...signatures).pipe(
      mergeMap((data) => {
        param.match.captainASignature = data[0];
        param.match.captainBSignature = data[1];
        param.match.judgeSignature = data[2];
        return this.matchContract
          .update(
            {
              fixtureStageId: param.fixtureStageId,
              tournamentId: param.tournamentId,
              groupId: param.groupId,
              matchId: param.match.id,
            },
            param.match
          )
          .pipe(
            map((data) => {
              return param.match;
            })
          );
      })
    );
  }
}
