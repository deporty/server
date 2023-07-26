"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModulesConfig = void 0;
const permission_contract_1 = require("./domain/permission.contract");
const get_role_by_id_usecase_1 = require("./domain/usecases/get-role-by-id.usecase");
const permission_mapper_1 = require("./infrastructure/permission.mapper");
const permissions_repository_1 = require("./infrastructure/permissions.repository");
class RoleModulesConfig {
    static config(container) {
        container.add({
            id: 'RoleMapper',
            kind: permission_mapper_1.RoleMapper,
            dependencies: ['Firestore'],
            strategy: 'singleton',
        });
        container.add({
            id: 'RoleContract',
            kind: permission_contract_1.RoleContract,
            override: permissions_repository_1.RoleRepository,
            dependencies: ['Firestore', 'RoleMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetRoleByIdUsecase',
            kind: get_role_by_id_usecase_1.GetRoleByIdUsecase,
            dependencies: ['RoleContract'],
            strategy: 'singleton',
        });
    }
}
exports.RoleModulesConfig = RoleModulesConfig;
