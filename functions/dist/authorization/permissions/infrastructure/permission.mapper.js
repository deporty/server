"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class PermissionMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            id: { name: 'id' },
            name: { name: 'name' },
            display: { name: 'display' },
            resourceIds: { name: 'resources' },
        };
    }
}
exports.PermissionMapper = PermissionMapper;
