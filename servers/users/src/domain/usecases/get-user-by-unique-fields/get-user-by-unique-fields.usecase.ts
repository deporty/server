import { UserEntity } from '@deporty-org/entities/users';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';
import { generateError } from '@scifamek-open-source/iraca/helpers';
import { Observable, of, throwError, zip } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UserContract } from '../../contracts/user.contract';

interface Params {
  document: string;
  email: string;
}

export const MultipleUserWithUniqueData = generateError('MultipleUserWithUniqueData', `There are multiple users with the same unique data`);

export class GetUserByUniqueFieldsUsecase extends Usecase<Params, UserEntity | undefined> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(params: Params): Observable<UserEntity | undefined> {
    const filters: Filters = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const element: any = (params as any)[key];
        if (element != undefined && element != null && element != '') {
          filters[key] = {
            operator: '=',
            value: element,
          };
        }
      }
    }

    const $document = this.userContract.filter({
      document: {
        operator: '=',
        value: params.document,
      },
    });
    const $email = this.userContract.filter({
      email: {
        operator: '=',
        value: params.email,
      },
    });

    return zip($document, $email).pipe(
      mergeMap(([documentUsers, emailUsers]) => {
        const fullUsers: any = {};

        for (const user of documentUsers) {
          fullUsers[user.id!] = user;
        }

        for (const user of emailUsers) {
          fullUsers[user.id!] = user;
        }
        return Object.values<UserEntity[]>(fullUsers);
      }),
      mergeMap((users) => {
        if (users.length == 0) {
          return of(undefined);
        } else if (users.length == 1) {
          return of(users[0]);
        } else {
          return throwError(new MultipleUserWithUniqueData());
        }
      })
    );
  }
}
