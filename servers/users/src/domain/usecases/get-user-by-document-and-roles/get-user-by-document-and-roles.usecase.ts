import { UserEntity } from '@deporty-org/entities';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';

export const UserWithDocumentDoesNotExistError = generateError(
  'UserWithDocumentDoesNotExistError',
  `The user with the id {id} does not exist.`
);

export interface Param {
  document: string;
  roles?: string[];
}
export class GetUserByDocumentAndRolesUsecase extends Usecase<Param, UserEntity> {
  constructor(private userContract: UserContract) {
    super();
  }
  call(param: Param): Observable<UserEntity> {
    const filters: Filters = {
      document: {
        operator: '==',
        value: param.document,
      },
    };
    if (param.roles) {
      filters['roles'] = {
        operator: 'array-contains-any',
        value: param.roles,
      };
    }

    return this.userContract.filter(filters).pipe(
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
