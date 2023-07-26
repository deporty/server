"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaygroundMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class PlaygroundMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            name: { name: 'name' },
        };
    }
}
exports.PlaygroundMapper = PlaygroundMapper;
