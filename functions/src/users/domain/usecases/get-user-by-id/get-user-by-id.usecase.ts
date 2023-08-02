import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { UserContract } from '../../contracts/user.contract';
import { UserDoesNotExistException } from '../../user.exceptions';

export class GetUserByIdUsecase extends Usecase<string, UserEntity> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(id: string): Observable<UserEntity> {
    return this.userContract.getById(id).pipe(
      mergeMap((user: UserEntity | undefined) => {
        if (!user) {
          return throwError(new UserDoesNotExistException('id', id));
        }
        return of(user);
      })
    );
  }
}
