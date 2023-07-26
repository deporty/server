"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentCostByIdUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class CalculateTournamentCostByIdUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, tournamentContract, calculateTournamentCostUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.tournamentContract = tournamentContract;
        this.calculateTournamentCostUsecase = calculateTournamentCostUsecase;
    }
    call(tournamentId) {
        const $tournament = this.getTournamentByIdUsecase.call(tournamentId);
        return $tournament.pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((tournamentTemp) => {
            return this.calculateTournamentCostUsecase.call(tournamentTemp);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((tournamentTemp) => {
            return this.tournamentContract
                .update(tournamentTemp.tournament.id, tournamentTemp.tournament)
                .pipe((0, operators_1.map)((t) => {
                return tournamentTemp.results;
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.CalculateTournamentCostByIdUsecase = CalculateTournamentCostByIdUsecase;
