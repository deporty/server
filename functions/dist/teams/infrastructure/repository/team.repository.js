"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamRepository = void 0;
const team_contract_1 = require("../../domain/contracts/team.contract");
const teams_constants_1 = require("../teams.constants");
class TeamRepository extends team_contract_1.TeamContract {
    constructor(dataSource, mapper) {
        super(dataSource, mapper);
        this.dataSource = dataSource;
        this.mapper = mapper;
        this.entity = teams_constants_1.TEAMS_ENTITY;
    }
}
exports.TeamRepository = TeamRepository;
