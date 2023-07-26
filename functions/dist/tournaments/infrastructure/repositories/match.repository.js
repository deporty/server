"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchRepository = void 0;
const match_contract_1 = require("../../domain/contracts/match.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class MatchRepository extends match_contract_1.MatchContract {
    constructor(firestore, matchMapper) {
        super(firestore, matchMapper);
        this.firestore = firestore;
        this.matchMapper = matchMapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id: accessParams.groupId },
            { collection: tournaments_constants_1.MATCHS_ENTITY, id },
        ]);
    }
    delete(accessParams, id) {
        return super.innerDelete([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id: accessParams.groupId },
            { collection: tournaments_constants_1.MATCHS_ENTITY, id },
        ]);
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id: accessParams.groupId },
            { collection: tournaments_constants_1.MATCHS_ENTITY },
        ], pagination);
    }
    filter(accessParams, filter) {
        return super.innerFilter([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id: accessParams.groupId },
            { collection: tournaments_constants_1.MATCHS_ENTITY },
        ], { filters: filter });
    }
    update(accessParams, entity) {
        return this.innerUpdate([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id: accessParams.groupId },
            { collection: tournaments_constants_1.MATCHS_ENTITY, id: accessParams.matchId },
        ], entity);
    }
    save(accessParams, entity) {
        return this.innerSave([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id: accessParams.groupId },
            { collection: tournaments_constants_1.MATCHS_ENTITY },
        ], entity);
    }
}
exports.MatchRepository = MatchRepository;
