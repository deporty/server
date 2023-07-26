import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { UserContract } from '../../contracts/user.contract';
import { UserDoesNotExistException } from '../../user.exceptions';

export class GetUserInformationByEmailUsecase extends Usecase<
  string,
  UserEntity
> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(email: string): Observable<UserEntity> {
    return this.userContract
      .filter({
        'email': {
          operator: '==',
          value: email,
        },
      })
      .pipe(
        mergeMap((user: UserEntity[]) => {
          if (!user || user.length == 0) {
            return throwError(new UserDoesNotExistException('email', email));
          }
          return of(user[0]);
        })
      );
  }
}
