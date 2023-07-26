"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentCostUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class CalculateTournamentCostUsecase extends usecase_1.Usecase {
    constructor() {
        super();
    }
    call(tournament) {
        return (0, rxjs_1.of)(tournament).pipe((0, operators_1.map)((tournament) => {
            const tournamentTemp = Object.assign({}, tournament);
            // const NE = tournamentTemp.registeredTeams.length;
            // const NTP = tournamentTemp.organization.NTP;
            // const FMTA = tournamentTemp.organization.FMTA;
            const NE = 0;
            const NTP = 0;
            const FMTA = 0;
            const cost = NE * 16000 - (NTP != 0 ? 2000 * Math.log(NTP) * 10 : 0) - FMTA * 4000;
            tournamentTemp.financialStatements.ammount = cost;
            return {
                tournament: tournamentTemp,
                results: {
                    NE,
                    NTP,
                    FMTA,
                    cost,
                },
            };
        }));
    }
}
exports.CalculateTournamentCostUsecase = CalculateTournamentCostUsecase;
