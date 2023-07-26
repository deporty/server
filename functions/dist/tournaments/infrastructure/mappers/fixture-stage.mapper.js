"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureStageMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class FixtureStageMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            tournamentId: { name: 'tournament-id' },
            order: { name: 'order' },
            id: { name: 'id' },
        };
    }
}
exports.FixtureStageMapper = FixtureStageMapper;
