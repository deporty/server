import { UserEntity } from '@deporty-org/entities/users';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { UserContract } from '../../contracts/user.contract';

interface Params {
  document: string;
  email: string;
}



export class GetUserByUniqueFieldsUsecase extends Usecase<Params, UserEntity[] > {
  constructor(private userContract: UserContract) {
    super();
  }

  call(params: Params): Observable<UserEntity[] > {
    const $document = this.userContract.filter({
      or: {
        document: {
          operator: '==',
          value: params.document,
        },
        email: {
          operator: '==',
          value: params.email,
        },
      },
    });

    return $document;
  }
}
