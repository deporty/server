"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupOverviewInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class GetGroupOverviewInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(param) {
        return this.tournamentContract
            .getGroupOverview(param.tournamentId, param.stageId, param.groupLabel)
            .pipe((0, operators_1.map)((group) => {
            if (!!group) {
                return (0, rxjs_1.of)(group);
            }
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.LabeledGroupDoesNotExist(param.groupLabel));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.GetGroupOverviewInsideTournamentUsecase = GetGroupOverviewInsideTournamentUsecase;
