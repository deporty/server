import { Observable } from 'rxjs';
import { ROL } from '@deporty-org/entities/authorization';
import { UserContract } from '../../contracts/user.contract';
import { UserEntity } from '@deporty-org/entities';
import { Usecase } from '@scifamek-open-source/iraca/domain';

export interface Params {
  pageNumber: number;
  pageSize: number;
  rol: ROL;
}

export class GetUsersByRolUsecase extends Usecase<Params, UserEntity[]> {
  constructor(public userContract: UserContract) {
    super();
  }
  call(params: Params): Observable<UserEntity[]> {
    return this.userContract.get({
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    });
  }
}

