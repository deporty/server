import { UserEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';

export const UserWithDocumentDoesNotExistError = generateError(
  'UserWithDocumentDoesNotExistError',
  `The user with the id {id} does not exist.`
);

export class GetUserByDocumentUsecase extends Usecase<string, UserEntity> {
  constructor(private userContract: UserContract) {
    super();
  }
  call(document: string): Observable<UserEntity> {
    return this.userContract
      .filter({
        document: {
          operator: '==',
          value: document,
        },
      })
      .pipe(
        mergeMap((users) => {
          if (users.length > 0) {
            return of(users[0]);
          } else {
            return throwError(new UserWithDocumentDoesNotExistError());
          }
        })
      );
  }
}
