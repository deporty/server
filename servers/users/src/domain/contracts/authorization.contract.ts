import { Id } from '@deporty-org/entities';
import {
  PermissionEntity,
  ResourceEntity,
  RoleEntity,
} from '@deporty-org/entities/authorization';
import { Observable } from 'rxjs';

export abstract class AuthorizationContract {
  abstract getRoleById(roleId: Id): Observable<RoleEntity>;
  abstract getPermissionById(permissionId: Id): Observable<PermissionEntity>;
  abstract getResourceById(resourceId: Id): Observable<ResourceEntity>;
  abstract isAValidAccessKey(accessKey: string): Observable<boolean>;
}
