import { Id } from '@deporty-org/entities';
import { RoleEntity } from '@deporty-org/entities/authorization';
import { Observable } from 'rxjs';

export abstract class AuthorizationContract {
  abstract getRoleById(roleId: Id): Observable<RoleEntity>;
  abstract isAValidAccessKey(accessKey: string): Observable<boolean>;
}
