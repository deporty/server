"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIntergroupMatchesUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
class GetIntergroupMatchesUsecase extends usecase_1.Usecase {
    constructor(intergroupMatchContract) {
        super();
        this.intergroupMatchContract = intergroupMatchContract;
    }
    call(param) {
        return this.intergroupMatchContract.get({
            fixtureStageId: param.fixtureStageId,
            tournamentId: param.tournamentId,
        });
    }
}
exports.GetIntergroupMatchesUsecase = GetIntergroupMatchesUsecase;
