import { Id, PositionsTable } from '@deporty-org/entities';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { IntergroupMatchContract } from '../../../contracts/intergroup-match.contract';
import { GetIntergroupMatchByIdUsecase } from '../get-intergroup-match-by-id/get-intergroup-match-by-id.usecase';
import { CalculatePositionTableOfGroupUsecase } from '../../calculate-position-table-of-group/calculate-position-table-of-group.usecase';
import { GetTournamentByIdUsecase } from '../../get-tournament-by-id/get-tournament-by-id.usecase';

export interface Response {
  intergroupMatch: Id;
  positionsTable: { [index: Id]: PositionsTable };
}
export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  intergroupMatchId: Id;
}

export class DeleteIntergroupMatchUsecase extends Usecase<Param, Response> {
  constructor(
    private intergroupMatchContract: IntergroupMatchContract,
    private getIntergroupMatchByIdUsecase: GetIntergroupMatchByIdUsecase,
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,

    private calculatePositionTableOfGroupUsecase: CalculatePositionTableOfGroupUsecase
  ) {
    super();
  }
  call(param: Param): Observable<Response> {
    return zip(
      this.getIntergroupMatchByIdUsecase.call({
        ...param,
      }),
      this.getTournamentByIdUsecase.call(param.tournamentId)
    ).pipe(
      mergeMap(([prevMatch, tournament]) => {
        return this.intergroupMatchContract
          .delete(
            {
              fixtureStageId: param.fixtureStageId,
              tournamentId: param.tournamentId,
            },
            param.intergroupMatchId
          )
          .pipe(
            mergeMap(() => {
              return zip(
                this.calculatePositionTableOfGroupUsecase
                  .call({
                    fixtureStageId: param.fixtureStageId,
                    groupId: prevMatch.teamAGroupId,
                    organizationId: tournament.organizationId,
                    tournamentLayoutId: tournament.tournamentLayoutId,
                    tournamentId: param.tournamentId,
                  })
                  .pipe(
                    map((data) => {
                      return { groupId: prevMatch.teamAGroupId, positionsTable: data };
                    })
                  ),
                this.calculatePositionTableOfGroupUsecase
                  .call({
                    fixtureStageId: param.fixtureStageId,
                    groupId: prevMatch.teamBGroupId,
                    organizationId: tournament.organizationId,
                    tournamentLayoutId: tournament.tournamentLayoutId,
                    tournamentId: param.tournamentId,
                  })
                  .pipe(
                    map((data) => {
                      return { groupId: prevMatch.teamBGroupId, positionsTable: data };
                    })
                  ),

                of(param.intergroupMatchId)
              );
            }),
            map(([positionTableA, positionTableB, match]) => {
              return {
                intergroupMatch: match,
                positionsTable: {
                  [positionTableA['groupId']]: positionTableA['positionsTable'],
                  [positionTableB['groupId']]: positionTableB['positionsTable'],
                },
              };
            })
          );
      })
    );
  }
}
