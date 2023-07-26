import { Id } from '@deporty-org/entities';
import {
  PermissionEntity,
  RoleEntity,
} from '@deporty-org/entities/authorization';
import { Observable, of, zip } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Usecase } from '../../../../core/usecase';
import { GetRoleByIdUsecase } from '../../../roles/domain/usecases/get-role-by-id.usecase';
import { GetPermissionByIdUsecase } from '../../../permissions/domain/usecases/get-permission-by-id.usecase';
import { GetResourceByIdUsecase } from '../../../resources/domain/usecases/get-resource-by-id.usecase';

export class GetAllowedResourcesByRoleIdsUsecase extends Usecase<Id[], any[]> {
  constructor(
    private getRoleByIdUsecase: GetRoleByIdUsecase,
    private getPermissionByIdUsecase: GetPermissionByIdUsecase,
    private getResourceByIdUsecase: GetResourceByIdUsecase
  ) {
    super();
  }
  call(roleIds: Id[]): Observable<any[]> {
    return (
      roleIds.length > 0
        ? zip(
            ...roleIds.map((roleId: Id) => {
              return this.getRoleByIdUsecase.call(roleId);
            })
          )
        : of([])
    ).pipe(
      mergeMap((roles: RoleEntity[]) => {
        const permissionIds = [
          ...roles
            .map((role: RoleEntity) => {
              return role.permissionIds;
            })
            .reduce((acc, permissionIds) => {
              acc.push(...permissionIds);
              return acc;
            }, []),
        ];

        return permissionIds.length > 0
          ? zip(
              ...permissionIds.map((permissionId: Id) => {
                return this.getPermissionByIdUsecase.call(permissionId);
              })
            )
          : of([]);
      }),
      mergeMap((permissions: PermissionEntity[]) => {
        const fullResourcesIds = [
          ...permissions
            .map((permission: PermissionEntity) => {
              return permission.resourceIds;
            })
            .reduce((acc, resourcesIds) => {
              acc.push(...resourcesIds);
              return acc;
            }, []),
        ];

        return fullResourcesIds.length > 0
          ? zip(
              ...fullResourcesIds.map((resourceId: Id) => {
                return this.getResourceByIdUsecase.call(resourceId).pipe(
                  map((resource) => {
                    return {
                      name: resource.name,
                      id: resource.id,
                      visibility: resource.visibility,
                    };
                  })
                );
              })
            )
          : of([]);
      })
    );
  }
}
