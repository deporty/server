"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportRepository = void 0;
const sport_contract_1 = require("../../domain/contracts/sport.contract");
const teams_constants_1 = require("../teams.constants");
class SportRepository extends sport_contract_1.SportContract {
    constructor(dataSource, mapper) {
        super(dataSource, mapper);
        this.dataSource = dataSource;
        this.mapper = mapper;
        this.entity = teams_constants_1.SPORTS_ENTITY;
    }
}
exports.SportRepository = SportRepository;
