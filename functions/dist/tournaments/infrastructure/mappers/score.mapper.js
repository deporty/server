"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class ScoreMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            teamA: { name: 'team-a' },
            teamB: { name: 'team-b' },
        };
    }
}
exports.ScoreMapper = ScoreMapper;
