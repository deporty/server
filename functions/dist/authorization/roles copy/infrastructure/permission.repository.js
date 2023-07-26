"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const permission_contract_1 = require("../domain/permission.contract");
const permission_constants_1 = require("./permission.constants");
class RoleRepository extends permission_contract_1.RoleContract {
    constructor(dataSource, roleMapper) {
        super(dataSource, roleMapper);
        this.dataSource = dataSource;
        this.roleMapper = roleMapper;
        this.dataSource.entity = RoleRepository.entity;
    }
}
exports.RoleRepository = RoleRepository;
RoleRepository.entity = permission_constants_1.ROLES_ENTITY;
