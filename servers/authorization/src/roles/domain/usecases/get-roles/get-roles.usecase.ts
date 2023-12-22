import { RoleEntity } from '@deporty-org/entities/authorization';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { RoleContract } from '../../role.contract';


export class GetRolesUsecase extends Usecase<void, RoleEntity[]> {
  constructor(private roleContract: RoleContract) {
    super();
  }
  call(): Observable<RoleEntity[]> {
    return this.roleContract.get()
  }
}
