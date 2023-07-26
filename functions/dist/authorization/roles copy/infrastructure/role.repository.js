"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRepository = void 0;
const role_contract_1 = require("../domain/role.contract");
const role_constants_1 = require("./role.constants");
class RoleRepository extends role_contract_1.RoleContract {
    constructor(dataSource, roleMapper) {
        super(dataSource, roleMapper);
        this.dataSource = dataSource;
        this.roleMapper = roleMapper;
        this.dataSource.entity = RoleRepository.entity;
    }
}
exports.RoleRepository = RoleRepository;
RoleRepository.entity = role_constants_1.ROLES_ENTITY;
