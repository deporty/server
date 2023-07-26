"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMatchToGroupInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class AddMatchToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
    }
    call(param) {
        return this.getTournamentByIdUsecase.call(param.tournamentId).pipe((0, operators_1.catchError)((error) => (0, rxjs_1.throwError)(error)), (0, operators_1.map)((tournament) => {
        }));
    }
}
exports.AddMatchToGroupInsideTournamentUsecase = AddMatchToGroupInsideTournamentUsecase;
//# sourceMappingURL=add-match-to-group-inside-tournament.usecase.js.map