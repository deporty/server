import { Id, TOURNAMENT_STATUS_TYPE, TournamentEntity, TournamentStatusType } from '@deporty-org/entities';
import { Observable, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { UpdateTournamentUsecase } from '../update-tournament/update-tournament.usecase';
import { OrganizationContract } from '../../contracts/organization.contract';
import { CalculateTournamentCostUsecase } from '../calculate-tournament-cost/calculate-tournament-cost.usecase';

export class NotAllowedStatusModificationError extends Error {
  constructor() {
    super();
    this.name = 'NotAllowedStatusModificationError';
    this.message = `The tournament status can be modified.`;
  }
}

export interface Params {
  tournamentId: Id;
  status: TournamentStatusType;
}
export class ModifyTournamentStatusUsecase extends Usecase<Params, TournamentEntity> {
  constructor(
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private updateTournamentUsecase: UpdateTournamentUsecase,
    private organizationContract: OrganizationContract,
    private calculateTournamentCostUsecase: CalculateTournamentCostUsecase
  ) {
    super();
  }

  call(param: Params): Observable<TournamentEntity> {
    return this.getTournamentByIdUsecase.call(param.tournamentId).pipe(
      mergeMap((tournament: TournamentEntity) => {
        if (!TOURNAMENT_STATUS_TYPE.includes(param.status)) {
          return throwError(new NotAllowedStatusModificationError());
        }
        if (tournament.status == 'finished' && param.status != 'finished') {
          return throwError(new NotAllowedStatusModificationError());
        }
        if (tournament.status == 'deleted' && param.status != 'deleted') {
          return throwError(new NotAllowedStatusModificationError());
        }

        if (
          tournament.status == 'canceled' &&
          (param.status == 'check-in' || param.status == 'running' || param.status == 'finished' || param.status == 'draft')
        ) {
          return throwError(new NotAllowedStatusModificationError());
        }
        if (tournament.status == 'running' && (param.status == 'check-in' || param.status == 'draft')) {
          return throwError(new NotAllowedStatusModificationError());
        }

        if (param.status == 'running' && (tournament.status == 'check-in' || tournament.status == 'draft')) {
          tournament.startsDate = new Date();
        }
        tournament.status = param.status;
        if (param.status == 'finished') {

          return this.organizationContract.getTournamentLayoutByIdUsecase(tournament.organizationId, tournament.tournamentLayoutId).pipe(
            mergeMap((tournamentLayout) => {
              return this.calculateTournamentCostUsecase.call(tournament).pipe(
                map((t) => {
                  const newTournament: TournamentEntity = {
                    ...t['tournament'],
                    tournamentLayout,
                    financialStatements: {
                      ...t['tournament'].financialStatements,
                      amount: t['results']['matches']['cost'],
                    },
                  };
                  return newTournament;
                })
              );
            }),
            mergeMap((t) => {
              return this.updateTournamentUsecase.call(t);
            })
          );
        } else {
          return this.updateTournamentUsecase.call(tournament);
        }
      })
    );
  }
}
