"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentPlayersByTeamUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetCurrentPlayersByTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract, getTeamByIdUsecase) {
        super();
        this.teamContract = teamContract;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
    }
    call(teamId) {
        const $team = this.getTeamByIdUsecase.call(teamId);
        $team.pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((team) => { }));
    }
}
exports.GetCurrentPlayersByTeamUsecase = GetCurrentPlayersByTeamUsecase;
