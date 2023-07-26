"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentOverviewByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const get_tournament_overview_by_id_exceptions_1 = require("./get-tournament-overview-by-id.exceptions");
class GetTournamentOverviewByIdUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getById(tournamentId).pipe((0, operators_1.map)((tournament) => {
            if (!tournament) {
                return (0, rxjs_1.throwError)(new get_tournament_overview_by_id_exceptions_1.TournamentDoesNotExist(tournamentId));
            }
            return (0, rxjs_1.of)(tournament);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.GetTournamentOverviewByIdUsecase = GetTournamentOverviewByIdUsecase;
