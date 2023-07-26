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
        console.log("Roles : ", roleIds);
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
                    .reduce((acc, role) => {
                    acc.push(...role);
                    return acc;
                }, []),
            ];
            return permissionIds.length > 0
                ? (0, rxjs_1.zip)(...permissionIds.map((permissionId) => {
                    return this.getPermissionByIdUsecase.call(permissionId);
                }))
                : (0, rxjs_1.of)([]);
        }), (0, operators_1.mergeMap)((permissions) => {
            const resourcesIds = [
                ...permissions
                    .map((permission) => {
                    return permission.resourceIds;
                })
                    .reduce((acc, role) => {
                    acc.push(...role);
                    return acc;
                }, []),
            ];
            return resourcesIds.length > 0
                ? (0, rxjs_1.zip)(...resourcesIds.map((permissionId) => {
                    return this.getResourceByIdUsecase.call(permissionId);
                }))
                : (0, rxjs_1.of)([]);
        }));
    }
}
exports.GetAllowedResourcesByRoleIdsUsecase = GetAllowedResourcesByRoleIdsUsecase;
