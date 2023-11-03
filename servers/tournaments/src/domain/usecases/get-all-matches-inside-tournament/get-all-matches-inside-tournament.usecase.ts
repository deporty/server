import { Id, IntergroupMatchEntity, MatchEntity, MatchStatusType } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable, zip } from 'rxjs';
import { GetAllGroupMatchesByTournamentUsecase } from '../get-all-group-matches-by-tournament/get-all-group-matches-by-tournament.usecase';
import { GetMainDrawNodeMatchesoverviewUsecase } from '../get-main-draw-node-matches-overview/get-main-draw-node-matches-overview.usecase';
import { GetFullIntergroupMatchesUsecase } from '../get-full-intergroup-matches/get-full-intergroup-matches.usecase-';
import { map } from 'rxjs/operators';

export interface Param {
  tournamentId: Id;
  status: MatchStatusType[];
}

export class GetAllMatchesInsideTournamentUsecase extends Usecase<Param, MatchEntity[]> {
  constructor(
    private getAllGroupMatchesByTournamentUsecase: GetAllGroupMatchesByTournamentUsecase,
    private getMainDrawNodeMatchesoverviewUsecase: GetMainDrawNodeMatchesoverviewUsecase,
    private getFullIntergroupMatchesUsecase: GetFullIntergroupMatchesUsecase
  ) {
    super();
  }
  call(param: Param): Observable<MatchEntity[]> {
    const $groupMatches = this.getAllGroupMatchesByTournamentUsecase.call({
      tournamentId: param.tournamentId,
      status: param.status,
    });

    const $mainDrawMatches = this.getMainDrawNodeMatchesoverviewUsecase
      .call({
        tournamentId: param.tournamentId,
        status: param.status,
      })
      .pipe(
        map((matches) => {
          return matches.map((matches) => matches.match);
        })
      );

    const $intergroupMatches = this.getFullIntergroupMatchesUsecase
      .call({
        tournamentId: param.tournamentId,
        status: param.status,
      })
      .pipe(
        map((matches) => {
          const allMatches = Object.values(matches).reduce((prev: IntergroupMatchEntity[], curr) => {
            prev = [...prev, ...curr.matches];
            return prev;
          }, []);

          return allMatches.map((intergroupMatch) => intergroupMatch.match);
        })
      );
    return zip($groupMatches, $intergroupMatches, $mainDrawMatches).pipe(
      map(([groupMatches, intergroupMatches, mainDrawMatches]) => {
        return [...groupMatches, ...intergroupMatches, ...mainDrawMatches];
      })
    );
  }
}
