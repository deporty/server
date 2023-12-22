import { PermissionEntity } from '@deporty-org/entities/authorization';
import { Usecase } from '@scifamek-open-source/iraca/domain';
import { Observable } from 'rxjs';
import { PermissionContract } from '../../permission.contract';

export class GetPermissionsUsecase extends Usecase<string, PermissionEntity[]> {
  constructor(private permissionContract: PermissionContract) {
    super();
  }

  call(): Observable<PermissionEntity[]> {
    return this.permissionContract.get()
  }
}
