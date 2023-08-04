"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchesByRefereeIdRepository = void 0;
const matches_by_referee_id_contract_1 = require("../../domain/contracts/matches-by-referee-id.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class MatchesByRefereeIdRepository extends matches_by_referee_id_contract_1.MatchesByRefereeIdContract {
    constructor(dataSource, matchesByRefereeIdMapper) {
        super(dataSource, matchesByRefereeIdMapper);
        this.dataSource = dataSource;
        this.matchesByRefereeIdMapper = matchesByRefereeIdMapper;
        this.entity = MatchesByRefereeIdRepository.entity;
    }
}
exports.MatchesByRefereeIdRepository = MatchesByRefereeIdRepository;
MatchesByRefereeIdRepository.entity = tournaments_constants_1.MATCHES_BY_REFEREE_ID_ENTITY;
