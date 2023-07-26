"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class GetGroupByIdUsecase extends usecase_1.Usecase {
    constructor(groupContract) {
        super();
        this.groupContract = groupContract;
    }
    call(param) {
        return this.groupContract
            .getById({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
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
exports.GetGroupByIdUsecase = GetGroupByIdUsecase;
