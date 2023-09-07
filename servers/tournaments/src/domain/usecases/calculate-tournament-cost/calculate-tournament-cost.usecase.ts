import { TournamentEntity } from '@deporty-org/entities/tournaments';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export class CalculateTournamentCostUsecase extends Usecase<TournamentEntity, any> {
  constructor() {
    super();
  }

  call(tournament: TournamentEntity): Observable<any> {
    return of(tournament).pipe(
      map((tournament) => {
        const tournamentTemp = { ...tournament };
        // const NE = tournamentTemp.registeredTeams.length;
        // const NTP = tournamentTemp.organization.NTP;
        // const FMTA = tournamentTemp.organization.FMTA;

        const NE = 0;
        const NTP = 0;
        const FMTA = 0;
        const cost = NE * 16000 - (NTP != 0 ? 2000 * Math.log(NTP) * 10 : 0) - FMTA * 4000;
        tournamentTemp.financialStatements.ammount = cost;
        return {
          tournament: tournamentTemp,
          results: {
            NE,
            NTP,
            FMTA,
            cost,
          },
        };
      })
    );
  }
}
