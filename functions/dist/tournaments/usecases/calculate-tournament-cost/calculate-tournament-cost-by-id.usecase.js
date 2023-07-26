"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentCostByIdUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class CalculateTournamentCostByIdUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, tournamentContract) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        const $tournament = this.getTournamentByIdUsecase.call(tournamentId);
        return $tournament.pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((tournament) => {
            const NE = tournament.registeredTeams.length;
            const NTP = tournament.organization.NTP;
            const FMTA = tournament.organization.FMTA;
            const cost = NE * 16000 - (NTP != 0 ? 2000 * Math.log(NTP) * 10 : 0) - FMTA * 4000;
            tournament.financialStatements.ammount = cost;
            return this.tournamentContract.update(tournament.id, tournament).pipe((0, operators_1.map)((t) => {
                return { NE, NTP, FMTA, cost };
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.CalculateTournamentCostByIdUsecase = CalculateTournamentCostByIdUsecase;
