import { Id, MatchEntity } from '@deporty-org/entities';
import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usecase } from '../../../../../core/usecase';
import { GetMatchByTeamIdsUsecase } from '../../group-matches/get-match-by-team-ids/get-match-by-team-ids.usecase';
import { GetIntergroupMatchByTeamIdsUsecase } from '../../intergroup-matches/get-intergroup-match-by-team-ids/get-intergroup-match-by-team-ids.usecase';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
  teamAId: Id;
  teamBId: Id;
}

export class GetAnyMatchByTeamIdsUsecase extends Usecase<
  Param,
  MatchEntity | undefined
> {
  constructor(
    private getMatchByTeamIdsUsecase: GetMatchByTeamIdsUsecase,
    private getIntergroupMatchByTeamIdsUsecase: GetIntergroupMatchByTeamIdsUsecase
  ) {
    super();
  }
  call(param: Param): Observable<MatchEntity | undefined> {
    const $groupMatches = this.getMatchByTeamIdsUsecase.call(param);
    const $intergroupMatches =
      this.getIntergroupMatchByTeamIdsUsecase.call(param);

    const $zipped = zip($groupMatches, $intergroupMatches).pipe(
      map(([groupMatches, intergroupMatches]) => {
        if (intergroupMatches) {
          return intergroupMatches.match;
        }
        return groupMatches;
      })
    );
    return $zipped;
  }
}
