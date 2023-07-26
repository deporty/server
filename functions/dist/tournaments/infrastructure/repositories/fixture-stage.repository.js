"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureStageRepository = void 0;
const fixture_stage_contract_1 = require("../../domain/contracts/fixture-stage.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class FixtureStageRepository extends fixture_stage_contract_1.FixtureStageContract {
    constructor(dataSource, registeredTeamMapper) {
        super(dataSource, registeredTeamMapper);
        this.dataSource = dataSource;
        this.registeredTeamMapper = registeredTeamMapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id },
        ]);
    }
    delete(accessParams, id) {
        return super.innerDelete([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY, id },
        ]);
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY },
        ], pagination);
    }
    filter(accessParams, filters) {
        return super.innerFilter([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY },
        ], { filters });
    }
    update(accessParams, entity) {
        throw new Error('Method not implemented.');
    }
    save(accessParams, entity) {
        return super.innerSave([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.FIXTURE_STAGES_ENTITY },
        ], entity);
    }
}
exports.FixtureStageRepository = FixtureStageRepository;
FixtureStageRepository.entity = tournaments_constants_1.MAIN_DRAW_ENTITY;
