"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchInMainDrawInsideTournamentUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetMatchInMainDrawInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(param) {
        const $nodeMatch = this.tournamentContract.getNodeMatch(param.tournamentId, param.nodeMatchId);
        return $nodeMatch.pipe((0, operators_1.map)((tournament) => {
            return tournament;
        }));
    }
}
exports.GetMatchInMainDrawInsideTournamentUsecase = GetMatchInMainDrawInsideTournamentUsecase;
