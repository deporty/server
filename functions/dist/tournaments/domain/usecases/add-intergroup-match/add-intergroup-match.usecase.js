"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIntergroupMatchUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class AddIntergroupMatchUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(param) {
        return this.tournamentContract.addIntergroupMatch(param.tournamentId, param.stageId, param.intergroupMatch);
    }
}
exports.AddIntergroupMatchUsecase = AddIntergroupMatchUsecase;
