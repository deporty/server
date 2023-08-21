import { Id, MatchEntity } from '@deporty-org/entities';
import { Observable, of, zip } from 'rxjs';
import { Usecase } from '../../../../../core/usecase';
import { GetGroupMatchesUsecase } from '../../group-matches/get-group-matches/get-group-matches.usecase';
import { EditMatchInsideGroupUsecase } from '../../group-matches/edit-match-to-group-inside-tournament/edit-match-to-group-inside-tournament.usecase';
import { map, mergeMap } from 'rxjs/operators';

export interface Param {
  tournamentId: Id;
  fixtureStageId: Id;
  groupId: Id;
}
export class PublishAllMatchesByGroupUsecase extends Usecase<Param, MatchEntity[]> {
  constructor(private getGroupMatchesUsecase: GetGroupMatchesUsecase, private editMatchInsideGroupUsecase: EditMatchInsideGroupUsecase) {
    super();
  }

  call(param: Param): Observable<MatchEntity[]> {
    return this.getGroupMatchesUsecase
      .call({
        ...param,
        states: ['editing'],
      })
      .pipe(
        mergeMap((matches: MatchEntity[]) => {
          const temp = matches.map((match: MatchEntity) => {
            match.status = 'published';
            return match;
          });

          if (temp.length > 0) {
            return zip(
              ...temp.map((t) => {
                return this.editMatchInsideGroupUsecase.call({
                  ...param,
                  match: t,
                });
              })
            );
          }
          return of([]);
        }),

        map((data) => data.map((d) => d.match))
      );
  }
}
