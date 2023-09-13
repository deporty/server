import { Id } from '@deporty-org/entities';
import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, zip } from 'rxjs';
import { GetUserByIdUsecase } from '../get-user-by-id/get-user-by-id.usecase';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export class GetUsersByIdsUsecase extends Usecase<Id[], UserEntity[]> {
  constructor(private getUserByIdUsecase: GetUserByIdUsecase) {
    super();
  }

  call(ids: Id[]): Observable<UserEntity[]> {
    if (ids.length == 0) {
      return of([]);
    }
    const $ids = ids.map((id) => {
      return this.getUserByIdUsecase.call(id);
    });
    return zip(...$ids);
  }
}
