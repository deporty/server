"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntergroupMatchRepository = void 0;
const tournaments_constants_1 = require("../tournaments.constants");
const intergroup_match_contract_1 = require("../../domain/contracts/intergroup-match.contract");
class IntergroupMatchRepository extends intergroup_match_contract_1.IntergroupMatchContract {
    constructor(dataSource, intergroupMatchMapper) {
        super(dataSource, intergroupMatchMapper);
        this.dataSource = dataSource;
        this.intergroupMatchMapper = intergroupMatchMapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.INTERGROUP_MATCHES_ENTITY, id },
        ]);
    }
    delete(accessParams, id) {
        return super.innerDelete([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.INTERGROUP_MATCHES_ENTITY, id },
        ]);
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.INTERGROUP_MATCHES_ENTITY },
        ], pagination);
    }
    filter(accessParams, filters) {
        return super.innerFilter([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.INTERGROUP_MATCHES_ENTITY },
        ], { filters });
    }
    update(accessParams, entity) {
        return super.innerUpdate([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.INTERGROUP_MATCHES_ENTITY, id: entity.id },
        ], entity);
    }
    save(accessParams, entity) {
        return super.innerSave([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id: accessParams.fixtureStageId },
            { collection: tournaments_constants_1.INTERGROUP_MATCHES_ENTITY },
        ], entity);
    }
}
exports.IntergroupMatchRepository = IntergroupMatchRepository;
IntergroupMatchRepository.entity = tournaments_constants_1.INTERGROUP_MATCHES_ENTITY;
