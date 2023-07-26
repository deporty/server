"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisteredTeamsRepository = void 0;
const registered_teams_contract_1 = require("../../domain/contracts/registered-teams.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class RegisteredTeamsRepository extends registered_teams_contract_1.RegisteredTeamsContract {
    constructor(dataSource, registeredTeamMapper) {
        super(dataSource, registeredTeamMapper);
        this.dataSource = dataSource;
        this.registeredTeamMapper = registeredTeamMapper;
    }
    getById(accessParams, id) {
        return super.innerGetById([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.REGISTERED_TEAMS_ENTITY, id },
        ]);
    }
    delete(accessParams, id) {
        return super.innerDelete([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.REGISTERED_TEAMS_ENTITY, id },
        ]);
    }
    get(accessParams, pagination) {
        return super.innerGet([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.REGISTERED_TEAMS_ENTITY },
        ], pagination);
    }
    filter(accessParams, filter) {
        return super.innerFilter([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.REGISTERED_TEAMS_ENTITY },
        ]);
    }
    update(accessParams, entity) {
        return super.innerUpdate([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.REGISTERED_TEAMS_ENTITY, id: entity.id },
        ], entity);
    }
    save(accessParams, entity) {
        return super.innerSave([
            { collection: tournaments_constants_1.TOURNAMENTS_ENTITY, id: accessParams.tournamentId },
            { collection: tournaments_constants_1.REGISTERED_TEAMS_ENTITY },
        ], entity);
    }
}
exports.RegisteredTeamsRepository = RegisteredTeamsRepository;
RegisteredTeamsRepository.entity = tournaments_constants_1.REGISTERED_TEAMS_ENTITY;
