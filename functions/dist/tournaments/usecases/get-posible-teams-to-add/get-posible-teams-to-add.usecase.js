"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPosibleTeamsToAddUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetPosibleTeamsToAddUsecase extends usecase_1.Usecase {
    constructor(getTeamsUsecase, getTournamentByIdUsecase) {
        super();
        this.getTeamsUsecase = getTeamsUsecase;
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
    }
    call(tournamentId) {
        const $teams = this.getTeamsUsecase.call();
        const $tournament = this.getTournamentByIdUsecase.call(tournamentId);
        return (0, rxjs_1.zip)($teams, $tournament).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((data) => {
            const registeredTeamsId = data[1].registeredTeams.map((item) => {
                return item.team.id;
            });
            const filteredTeams = data[0].filter((item) => {
                return registeredTeamsId.indexOf(item.id) < 0;
            });
            return filteredTeams;
        }));
    }
}
exports.GetPosibleTeamsToAddUsecase = GetPosibleTeamsToAddUsecase;
