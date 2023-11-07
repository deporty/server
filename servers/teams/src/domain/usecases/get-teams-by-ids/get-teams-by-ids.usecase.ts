import { Id, TeamEntity } from '@deporty-org/entities';
import { Observable, of, zip } from 'rxjs';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { GetTeamByIdUsecase } from '../get-team-by-id/get-team-by-id.usecase';
import { catchError, map } from 'rxjs/operators';

export class GetTeamsByIdsUsecase extends Usecase<Id[], TeamEntity[]> {
  constructor(public getTeamByIdUsecase: GetTeamByIdUsecase) {
    super();
  }
  call(ids: Id[]): Observable<TeamEntity[]> {
    return ids.length > 0
      ? zip(...ids.map((id) => this.getTeamByIdUsecase.call(id).pipe(catchError(() => of(undefined))))).pipe(
          map((data: (TeamEntity | undefined)[]) => {
            return data.filter((item) => !!item) as TeamEntity[];
          })
        )
      : of([]);
  }
}
