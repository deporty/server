"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentRepository = exports.TournamentContract = void 0;
const transversal_contract_1 = require("../../../core/transversal-contract");
const tournaments_constants_1 = require("../tournaments.constants");
class TournamentContract extends transversal_contract_1.TransversalContract {
}
exports.TournamentContract = TournamentContract;
class TournamentRepository extends TournamentContract {
    constructor(dataSource, tournamentMapper) {
        super(dataSource, tournamentMapper);
        this.dataSource = dataSource;
        this.tournamentMapper = tournamentMapper;
        this.entity = TournamentRepository.entity;
    }
}
exports.TournamentRepository = TournamentRepository;
TournamentRepository.entity = tournaments_constants_1.TOURNAMENTS_ENTITY;
