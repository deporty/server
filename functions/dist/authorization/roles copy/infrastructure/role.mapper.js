"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class RoleMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            id: { name: 'id' },
            description: { name: 'description' },
            name: { name: 'name' },
            display: { name: 'display' },
            permissionIds: { name: 'permissions' },
        };
    }
}
exports.RoleMapper = RoleMapper;
