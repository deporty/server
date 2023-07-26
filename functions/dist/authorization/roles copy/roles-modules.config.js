"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModulesConfig = void 0;
const role_contract_1 = require("./domain/role.contract");
const get_role_by_id_usecase_1 = require("./domain/usecases/get-role-by-id.usecase");
const role_mapper_1 = require("./infrastructure/role.mapper");
const role_repository_1 = require("./infrastructure/role.repository");
class RoleModulesConfig {
    static config(container) {
        container.add({
            id: 'RoleMapper',
            kind: role_mapper_1.RoleMapper,
            dependencies: ['Firestore'],
            strategy: 'singleton',
        });
        container.add({
            id: 'RoleContract',
            kind: role_contract_1.RoleContract,
            override: role_repository_1.RoleRepository,
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
