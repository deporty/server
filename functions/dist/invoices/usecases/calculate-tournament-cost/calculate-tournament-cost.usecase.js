"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentCostUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class CalculateTournamentCostUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
    }
    call(params) {
        const $tournament = this.getTournamentByIdUsecase.call(params.tournamentId);
        return $tournament.pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((tournament) => {
            const NE = tournament.registeredTeams.length;
            const NTP = tournament.organization.NTP;
            const FMTA = tournament.organization.FMTA;
            const cost = (NE * 16000) - (NTP != 0 ? (2000 * Math.log(NTP) * 10) : 0) - (FMTA * 4000);
            // = (NE * 16000) - (2000 * log(NTP)*10)  - (FMTA * 4000)
            return cost;
        }));
    }
}
exports.CalculateTournamentCostUsecase = CalculateTournamentCostUsecase;
