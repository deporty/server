import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const UserDoesNotExistError = generateError('UserDoesNotExistError', `The user with the email {email} does not exist.`);

export class GetUserInformationByEmailUsecase extends Usecase<string, UserEntity> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(email: string): Observable<UserEntity> {
    return this.userContract
      .filter({
        email: {
          operator: '==',
          value: email,
        },
      })
      .pipe(
        mergeMap((user: UserEntity[]) => {
          if (!user || user.length == 0) {
            return throwError(new UserDoesNotExistError({ email }));
          }
          return of(user[0]);
        })
      );
  }
}
