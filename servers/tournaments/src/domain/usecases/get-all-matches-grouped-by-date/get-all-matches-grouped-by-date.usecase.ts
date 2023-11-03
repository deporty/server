import { Id, MatchEntity } from '@deporty-org/entities';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetAllMatchesInsideTournamentUsecase } from '../get-all-matches-inside-tournament/get-all-matches-inside-tournament.usecase';

const moment = require('moment');
const defaultFormat = 'dddd D MMM YYYY';

export class GetAllMatchesGroupedByDateUsecase extends Usecase<Id, any> {
  constructor(
    private getAllMatchesInsideTournamentUsecase: GetAllMatchesInsideTournamentUsecase,
  ) {
    super();
  }

  call(tournamentId: Id): Observable<any> {
    return this.getAllMatchesInsideTournamentUsecase
      .call({ tournamentId, status: ['completed', 'in-review', 'published'] })
      .pipe(
        map((matches: MatchEntity[]) => {
          return matches.filter((m) => {
            return !!m.date;
          });
        }),
        map((matches: MatchEntity[]) => {
          return matches.reduce((prev: any, curr) => {
            const date = moment(curr.date).format(defaultFormat);
            if (!prev[date]) {
              prev[date] = [];
            }
            prev[date].push(curr);
            return prev;
          }, {});
        })
      );
  }
}
