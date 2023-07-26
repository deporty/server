"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionRepository = void 0;
const permission_contract_1 = require("../domain/permission.contract");
const permission_constants_1 = require("./permission.constants");
class PermissionRepository extends permission_contract_1.PermissionContract {
    constructor(dataSource, permissionMapper) {
        super(dataSource, permissionMapper);
        this.dataSource = dataSource;
        this.permissionMapper = permissionMapper;
        this.entity = PermissionRepository.entity;
    }
}
exports.PermissionRepository = PermissionRepository;
PermissionRepository.entity = permission_constants_1.PERMISSIONS_ENTITY;
