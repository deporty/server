import { UserEntity } from '@deporty-org/entities/users';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';

export const UserDoesNotExistByFullNameError = generateError(
  'UserDoesNotExistByFullNameError',
  `The user with the fullname {fullName} does not exist.`
);

interface Params {
  names: string;
  lastNames: string;
}
export class GetUserInformationByFullNameUsecase extends Usecase<Params, UserEntity[]> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(params: Params): Observable<UserEntity[]> {
    return this.userContract
      .filter({
        name: {
          operator: '==',
          value: params.names,
        },
        lastName: {
          operator: '==',
          value: params.lastNames,
        },
      })
      .pipe(
        mergeMap((user: UserEntity[] | undefined) => {
          if (!user) {
            return throwError(new UserDoesNotExistByFullNameError({ fullName: `${params.names} ${params.lastNames}` }));
          }
          return of(user);
        })
      );
  }
}
