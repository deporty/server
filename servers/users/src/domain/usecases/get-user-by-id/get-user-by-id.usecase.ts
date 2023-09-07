import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export const UserDoesNotExistByIdError = generateError('UserDoesNotExistByIdError', `The user with the id {id} does not exist.`);

export class GetUserByIdUsecase extends Usecase<string, UserEntity> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(id: string): Observable<UserEntity> {
    return this.userContract.getById(id).pipe(
      mergeMap((user: UserEntity | undefined) => {
        if (!user) {
          return throwError(new UserDoesNotExistByIdError({ id }));
        }
        return of(user);
      })
    );
  }
}
