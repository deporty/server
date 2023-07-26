"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerFormMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class PlayerFormMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            teamA: { name: 'team-a' },
            teamB: { name: 'team-b' },
            matchId: { name: 'match-id' },
            id: { name: 'id' },
        };
    }
}
exports.PlayerFormMapper = PlayerFormMapper;
