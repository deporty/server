import { Usecase } from '../../../../core/usecase';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';
import { TournamentContract } from '../../contracts/tournament.contract';
import { CalculateTournamentCostUsecase } from '../calculate-tournament-cost/calculate-tournament-cost.usecase';

export class CalculateTournamentCostByIdUsecase extends Usecase<string, any> {
  constructor(
    private getTournamentByIdUsecase: GetTournamentByIdUsecase,
    private tournamentContract: TournamentContract,
    private calculateTournamentCostUsecase: CalculateTournamentCostUsecase
  ) {
    super();
  }

  call(tournamentId: string): Observable<any> {
    const $tournament = this.getTournamentByIdUsecase.call(tournamentId);
    return $tournament.pipe(
      catchError((error) => {
        return throwError(error);
      }),
      map((tournamentTemp) => {
        return this.calculateTournamentCostUsecase.call(tournamentTemp);
      }),
      mergeMap((x) => x),
      map((tournamentTemp) => {
        return this.tournamentContract
          .update(tournamentTemp.tournament.id, tournamentTemp.tournament)
          .pipe(
            map((t) => {
              return tournamentTemp.results;
            })
          );
      }),
      mergeMap((x) => x)
    );
  }
}
