"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRegisteredTeamsByTournamentIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const tournaments_exceptions_1 = require("../tournaments.exceptions");
class GetRegisteredTeamsByTournamentIdUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getRegisteredTeams(tournamentId).pipe((0, operators_1.map)((data) => {
            if (!data) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.TournamentDoesNotExist(tournamentId));
            }
            else {
                return (0, rxjs_1.of)(data);
            }
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.GetRegisteredTeamsByTournamentIdUsecase = GetRegisteredTeamsByTournamentIdUsecase;
