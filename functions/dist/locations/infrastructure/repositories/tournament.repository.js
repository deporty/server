"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentRepository = void 0;
const tournament_contract_1 = require("../../domain/tournament.contract");
const tournaments_constants_1 = require("../tournaments.constants");
class TournamentRepository extends tournament_contract_1.TournamentContract {
    constructor(dataSource, tournamentMapper) {
        super(dataSource, tournamentMapper);
        this.dataSource = dataSource;
        this.tournamentMapper = tournamentMapper;
        this.entity = TournamentRepository.entity;
    }
}
exports.TournamentRepository = TournamentRepository;
TournamentRepository.entity = tournaments_constants_1.TOURNAMENTS_ENTITY;
