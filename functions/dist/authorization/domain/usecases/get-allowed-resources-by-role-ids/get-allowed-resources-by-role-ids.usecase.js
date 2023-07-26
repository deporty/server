"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllowedResourcesByRoleIdsUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetAllowedResourcesByRoleIdsUsecase extends usecase_1.Usecase {
    constructor(getRoleByIdUsecase, getPermissionByIdUsecase, getResourceByIdUsecase) {
        super();
        this.getRoleByIdUsecase = getRoleByIdUsecase;
        this.getPermissionByIdUsecase = getPermissionByIdUsecase;
        this.getResourceByIdUsecase = getResourceByIdUsecase;
    }
    call(roleIds) {
        return (roleIds.length > 0
            ? (0, rxjs_1.zip)(...roleIds.map((roleId) => {
                return this.getRoleByIdUsecase.call(roleId);
            }))
            : (0, rxjs_1.of)([])).pipe((0, operators_1.mergeMap)((roles) => {
            const permissionIds = [
                ...roles
                    .map((role) => {
                    return role.permissionIds;
                })
                    .reduce((acc, permissionIds) => {
                    acc.push(...permissionIds);
                    return acc;
                }, []),
            ];
            return permissionIds.length > 0
                ? (0, rxjs_1.zip)(...permissionIds.map((permissionId) => {
                    return this.getPermissionByIdUsecase.call(permissionId);
                }))
                : (0, rxjs_1.of)([]);
        }), (0, operators_1.mergeMap)((permissions) => {
            const fullResourcesIds = [
                ...permissions
                    .map((permission) => {
                    return permission.resourceIds;
                })
                    .reduce((acc, resourcesIds) => {
                    acc.push(...resourcesIds);
                    return acc;
                }, []),
            ];
            return fullResourcesIds.length > 0
                ? (0, rxjs_1.zip)(...fullResourcesIds.map((resourceId) => {
                    return this.getResourceByIdUsecase.call(resourceId).pipe((0, operators_1.map)((resource) => {
                        return {
                            name: resource.name,
                            id: resource.id,
                            visibility: resource.visibility,
                        };
                    }));
                }))
                : (0, rxjs_1.of)([]);
        }));
    }
}
exports.GetAllowedResourcesByRoleIdsUsecase = GetAllowedResourcesByRoleIdsUsecase;
