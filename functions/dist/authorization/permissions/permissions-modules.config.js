"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModulesConfig = void 0;
const permission_contract_1 = require("./domain/permission.contract");
const get_permission_by_id_usecase_1 = require("./domain/usecases/get-permission-by-id.usecase");
const permission_mapper_1 = require("./infrastructure/permission.mapper");
const permission_repository_1 = require("./infrastructure/permission.repository");
class PermissionModulesConfig {
    static config(container) {
        container.add({
            id: 'PermissionMapper',
            kind: permission_mapper_1.PermissionMapper,
            strategy: 'singleton',
        });
        container.add({
            id: 'PermissionContract',
            kind: permission_contract_1.PermissionContract,
            override: permission_repository_1.PermissionRepository,
            dependencies: ['DataSource', 'PermissionMapper'],
            strategy: 'singleton',
        });
        container.add({
            id: 'GetPermissionByIdUsecase',
            kind: get_permission_by_id_usecase_1.GetPermissionByIdUsecase,
            dependencies: ['PermissionContract'],
            strategy: 'singleton',
        });
    }
}
exports.PermissionModulesConfig = PermissionModulesConfig;
