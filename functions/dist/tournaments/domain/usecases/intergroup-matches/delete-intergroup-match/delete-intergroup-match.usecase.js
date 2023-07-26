"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteIntergroupMatchUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class DeleteIntergroupMatchUsecase extends usecase_1.Usecase {
    constructor(intergroupMatchContract) {
        super();
        this.intergroupMatchContract = intergroupMatchContract;
    }
    call(param) {
        return this.intergroupMatchContract
            .delete({
            fixtureStageId: param.fixtureStageId,
            tournamentId: param.tournamentId,
        }, param.intergroupMatchId)
            .pipe((0, operators_1.map)(() => {
            return param.intergroupMatchId;
        }));
    }
}
exports.DeleteIntergroupMatchUsecase = DeleteIntergroupMatchUsecase;
