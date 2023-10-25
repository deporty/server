import { Id, IntergroupMatchEntity, StadisticSpecification } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, zip } from 'rxjs';
import { GetAllGroupMatchesByTournamentUsecase } from '../get-all-group-matches-by-tournament/get-all-group-matches-by-tournament.usecase';
import { GetMainDrawNodeMatchesoverviewUsecase } from '../get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase';
import { GetFullIntergroupMatchesUsecase } from '../get-full-intergroup-matches/get-full-intergroup-matches.usecase-';
import { map } from 'rxjs/operators';

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
  constructor(
    private getAllGroupMatchesByTournamentUsecase: GetAllGroupMatchesByTournamentUsecase,

    private getMainDrawNodeMatchesoverviewUsecase: GetMainDrawNodeMatchesoverviewUsecase,
    private getFullIntergroupMatchesUsecase: GetFullIntergroupMatchesUsecase
  ) {
    super();
  }
  call(tournamentId: string): Observable<Response[]> {
    const $groupMatches = this.getAllGroupMatchesByTournamentUsecase.call({
      tournamentId,
      status: ['completed', 'in-review'],
    });

    const $mainDrawMatches = this.getMainDrawNodeMatchesoverviewUsecase.call(tournamentId).pipe(
      map((matches) => {
        return matches.filter((matches) => matches.match.status in ['completed', 'in-review']).map((matches) => matches.match);
      })
    );

    const $intergroupMatches = this.getFullIntergroupMatchesUsecase
      .call({
        tournamentId,
        status: ['completed', 'in-review'],
      })
      .pipe(
        map((matches) => {
          const allMatches = Object.values(matches).reduce((prev: IntergroupMatchEntity[], curr) => {
            prev = [...prev, ...curr.matches];
            return prev;
          }, []);
          return allMatches.filter((matches) => matches.match.status in ['completed', 'in-review']).map((matches) => matches.match);
        })
      );
    return zip($groupMatches, $intergroupMatches, $mainDrawMatches).pipe(
      map(([groupMatches, intergroupMatches, mainDrawMatches]) => {
        const response: Response[] = [...groupMatches, ...intergroupMatches, ...mainDrawMatches]
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
          return response
      })
    );
  }
}
