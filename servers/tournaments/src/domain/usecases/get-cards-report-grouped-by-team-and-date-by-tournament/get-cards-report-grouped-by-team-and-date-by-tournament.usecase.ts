import { Id } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { GetCardsReportByTournamentUsecase } from '../get-cards-report-by-tournament/get-cards-report-by-tournament.usecase';
import { map } from 'rxjs/operators';
const moment = require('moment');

export interface Response {
  [date: string]: {
    [teamId: string]: any;
  };
}

export class GetCardsReportGroupedByTeamAndDateByTournamentUsecase extends Usecase<Id, Response> {
  constructor(private getCardsReportByTournamentUsecase: GetCardsReportByTournamentUsecase) {
    super();
  }
  call(tournamentId: string): Observable<Response> {
    return this.getCardsReportByTournamentUsecase.call(tournamentId).pipe(
      map((data) => {
        return data.reduce((prev: any, curr) => {
          if (curr.date) {
            const keyDate = moment(curr.date);
            const key = keyDate.format('DD-MM-YYYY')
            if (!prev[key]) {
              prev[key] = {};
            }

            if (!prev[key][curr.teamId]) {
              prev[key][curr.teamId] = [];
            }
            prev[key][curr.teamId].push(curr);
          }
          return prev;
        }, {});
      })
    );
  }
}
