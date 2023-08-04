"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesByRefereeIdMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class MatchesByRefereeIdMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            refereeId: { name: "referee-id" },
            tournamentId: { name: "tournament-id" },
            kind: { name: "kind" },
            id: { name: "id" },
            fixtureStageId: { name: "fixture-stage-id" },
            groupId: { name: "group-id" },
            matchId: { name: "match-id" },
        };
    }
}
exports.MatchesByRefereeIdMapper = MatchesByRefereeIdMapper;
