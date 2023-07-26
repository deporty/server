"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class GetTournamentByIdUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getById(tournamentId).pipe((0, operators_1.mergeMap)((tournament) => {
            if (!tournament) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.TournamentDoesNotExistError(tournamentId));
            }
            return (0, rxjs_1.of)(tournament);
        }));
    }
}
exports.GetTournamentByIdUsecase = GetTournamentByIdUsecase;
