"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIntergroupMatchesUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetIntergroupMatchesUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(param) {
        return this.tournamentContract.getIntergroupMatches(param.tournamentId, param.stageId);
    }
}
exports.GetIntergroupMatchesUsecase = GetIntergroupMatchesUsecase;
