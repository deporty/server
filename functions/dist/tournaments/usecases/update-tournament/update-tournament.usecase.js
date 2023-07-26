"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTournamentUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class UpdateTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournament) {
        return this.tournamentContract.update(tournament.id, tournament).pipe((0, operators_1.tap)((x) => {
        }));
    }
}
exports.UpdateTournamentUsecase = UpdateTournamentUsecase;
