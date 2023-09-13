import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TournamentContract } from '../../contracts/tournament.contract';
import { CalculateTournamentCostUsecase } from '../calculate-tournament-cost/calculate-tournament-cost.usecase';
import { GetTournamentByIdUsecase } from '../get-tournament-by-id/get-tournament-by-id.usecase';

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
      mergeMap((tournamentTemp) => {
        return this.calculateTournamentCostUsecase.call(tournamentTemp);
      }),
      mergeMap((tournamentTemp) => {
        return this.tournamentContract.update(tournamentTemp.tournament.id, tournamentTemp.tournament).pipe(
          map((t) => {
            return tournamentTemp.results;
          })
        );
      })
    );
  }
}
