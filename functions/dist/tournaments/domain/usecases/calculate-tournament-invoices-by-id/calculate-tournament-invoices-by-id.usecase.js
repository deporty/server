"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentInvoicesById = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class CalculateTournamentInvoicesById extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, calculateTournamentInvoices) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.calculateTournamentInvoices = calculateTournamentInvoices;
    }
    call(tournamentId) {
        return this.getTournamentByIdUsecase.call(tournamentId).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((tournament) => {
            return this.calculateTournamentInvoices.call(tournament);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.CalculateTournamentInvoicesById = CalculateTournamentInvoicesById;
