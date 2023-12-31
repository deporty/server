import { Id } from '@deporty-org/entities';
import { UserEntity } from '@deporty-org/entities/users';
import { Observable } from 'rxjs';
import { UserContract } from '../../contracts/user.contract';
import { Filters, Usecase } from '@scifamek-open-source/iraca/domain';

interface Params {
  firstName: string;
  firstLastName: string;
  secondName: string;
  secondLastName: string;
  roles: Id[];
}




export class GetUsersByFiltersUsecase extends Usecase<Params, UserEntity[]> {
  constructor(private userContract: UserContract) {
    super();
  }

  call(params: Params): Observable<UserEntity[]> {
    const filters: Filters = {};
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const element: any = (params as any)[key];
        if (element != undefined && element != null && element != '') {
          if (Array.isArray(element)) {
            filters[key] = {
              operator: 'array-contains-any',
              value: element,
            };
          } else {
            filters[key] = {
              operator: 'contains',
              value: element,
            };
          }
        }
      }
    }

    return this.userContract.filter(filters);
  }
}
