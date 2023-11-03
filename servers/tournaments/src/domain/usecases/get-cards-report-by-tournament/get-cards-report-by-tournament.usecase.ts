import { Id, StadisticSpecification } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetAllMatchesInsideTournamentUsecase } from '../get-all-matches-inside-tournament/get-all-matches-inside-tournament.usecase';

export interface Response {
  teamId: string;
  memberId: string;
  date?: Date;
  cards: {
    yellow: number;
    red: number;
  };
}

export class GetCardsReportByTournamentUsecase extends Usecase<Id, Response[]> {
  constructor(private getAllMatchesInsideTournamentUsecase: GetAllMatchesInsideTournamentUsecase) {
    super();
  }
  call(tournamentId: string): Observable<Response[]> {

    return this.getAllMatchesInsideTournamentUsecase
      .call({
        tournamentId,
        status: ['completed', 'in-review'],
      })
      .pipe(
        map((data) => {
          const response: Response[] = data
            .map((m) => {
              const mapStadistics = (tStadistics: StadisticSpecification[] | undefined) =>
                tStadistics?.map((t) => ({
                  memberId: t.memberId,
                  cards: {
                    red: t.totalRedCards,
                    yellow: t.totalYellowCards,
                  },
                }));

              const teamA =
                mapStadistics(m.stadistics?.teamA)?.map((x) => {
                  return {
                    ...x,
                    teamId: m.teamAId,
                    date: m.date,
                  };
                }) || [];
              const teamB =
                mapStadistics(m.stadistics?.teamB)?.map((x) => {
                  return {
                    ...x,
                    teamId: m.teamBId,
                    date: m.date,
                  };
                }) || [];
              return [...teamA, ...teamB];
            })
            .reduce((p, c) => {
              p = [...p, ...c];

              return p;
            }, []);

          return response.filter((x) => {
            return x.cards.red || x.cards.yellow;
          });
        })
      );
  }
}
