"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGroupByIdUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class DeleteGroupByIdUsecase extends usecase_1.Usecase {
    constructor(getGroupByIdUsecase, groupContract) {
        super();
        this.getGroupByIdUsecase = getGroupByIdUsecase;
        this.groupContract = groupContract;
    }
    call(param) {
        const params = {
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
        };
        return this.getGroupByIdUsecase.call(params).pipe((0, operators_1.mergeMap)((group) => {
            return this.groupContract.delete(params, param.groupId);
        }));
    }
}
exports.DeleteGroupByIdUsecase = DeleteGroupByIdUsecase;
