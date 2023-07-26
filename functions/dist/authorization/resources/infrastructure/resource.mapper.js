"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class ResourceMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            id: { name: 'id' },
            domain: { name: 'domain' },
            kind: { name: 'kind' },
            layer: { name: 'layer' },
            name: { name: 'name' },
            visibility: { name: 'visibility' },
        };
    }
}
exports.ResourceMapper = ResourceMapper;
