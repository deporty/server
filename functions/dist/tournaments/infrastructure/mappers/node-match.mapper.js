"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeMatchMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class NodeMatchMapper extends mapper_1.Mapper {
    constructor(matchMapper) {
        super();
        this.matchMapper = matchMapper;
        this.attributesMapper = {
            key: { name: 'key' },
            id: { name: 'id' },
            level: { name: 'level' },
            match: {
                name: 'match',
                from: (value) => {
                    return this.matchMapper.fromJson(value);
                },
                to: (value) => {
                    return this.matchMapper.toJson(value);
                },
            },
        };
    }
}
exports.NodeMatchMapper = NodeMatchMapper;
