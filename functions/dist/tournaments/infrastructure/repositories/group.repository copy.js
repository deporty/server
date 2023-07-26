"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupRepository = void 0;
const group_contract_1 = require("../contracts/group.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class GroupRepository extends group_contract_1.GroupContract {
    constructor(firestore, groupMapper) {
        super(firestore, groupMapper);
        this.firestore = firestore;
        this.groupMapper = groupMapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id },
        ]);
    }
    delete(accessParams, id) {
        return super.innerDelete([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id },
        ]);
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY },
        ], pagination);
    }
    filter(accessParams, filter) {
        return super.innerFilter([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY },
        ], { filters: filter });
    }
    update(accessParams, entity) {
        return this.innerUpdate([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY, id: accessParams.groupId },
        ], entity);
    }
    save(accessParams, entity) {
        return this.innerSave([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.GROUPS_ENTITY },
        ], entity);
    }
}
exports.GroupRepository = GroupRepository;
