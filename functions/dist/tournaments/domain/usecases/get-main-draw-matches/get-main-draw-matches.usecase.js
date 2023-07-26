"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMainDrawMatchesUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetMainDrawMatchesUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getMainDrawMatches(tournamentId);
    }
}
exports.GetMainDrawMatchesUsecase = GetMainDrawMatchesUsecase;
