import { FINANCIAL_STATUS_TYPE, FinancialStatusType, Id, TournamentEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { UpdateTournamentUsecase } from '../update-tournament/update-tournament.usecase';

export class NotAllowedStatusModificationError extends Error {
  constructor() {
    super();
    this.name = 'NotAllowedStatusModificationError';
    this.message = `The tournament status can be modified.`;
  }
}

export interface Params {
  tournamentId: Id;
  financialStatus: FinancialStatusType;
}
export class ModifyTournamentFinancialStatusUsecase extends Usecase<Params, TournamentEntity> {
  constructor(private getTournamentByIdUsecase: GetTournamentByIdUsecase, private updateTournamentUsecase: UpdateTournamentUsecase) {
    super();
  }

  call(param: Params): Observable<TournamentEntity> {
    return this.getTournamentByIdUsecase.call(param.tournamentId).pipe(
      mergeMap((tournament: TournamentEntity) => {
        if (!FINANCIAL_STATUS_TYPE.includes(param.financialStatus)) {
          return throwError(new NotAllowedStatusModificationError());
        }

        tournament.financialStatus = param.financialStatus;
        

        return this.updateTournamentUsecase.call(tournament);
      })
    );
  }
}
