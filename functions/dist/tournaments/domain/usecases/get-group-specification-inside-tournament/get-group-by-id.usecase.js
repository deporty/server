"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupSpecificationInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class GetGroupSpecificationInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(groupContract) {
        super();
        this.groupContract = groupContract;
    }
    call(param) {
        return this.groupContract
            .getById({
            tournamentId: param.tournamentId,
            fixtureStageId: param.stageId,
            groupId: param.groupId,
        }, param.groupId)
            .pipe((0, operators_1.mergeMap)((group) => {
            if (!!group) {
                return (0, rxjs_1.of)(group);
            }
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.GroupDoesNotExist(param.groupId));
        }));
    }
}
exports.GetGroupSpecificationInsideTournamentUsecase = GetGroupSpecificationInsideTournamentUsecase;
