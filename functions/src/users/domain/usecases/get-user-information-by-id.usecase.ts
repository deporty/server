import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { catchAndThrow } from '../../../core/rxjs.helpers';
import { Usecase } from '../../../core/usecase';
import { UserContract } from '../contracts/user.contract';
import { UserDoesNotExistException } from '../user.exceptions';

export class GetUserInformationByIdUsecase extends Usecase<string, UserEntity> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(id: string): Observable<UserEntity> {
    return this.userContract.getById(id).pipe(
      map((user: UserEntity | undefined) => {
        if (!user) {
          return throwError(new UserDoesNotExistException('id',id));
        }
        return of(user);
      }),
      mergeMap((x) => x),
      catchAndThrow<UserEntity>()
    );
  }
}
