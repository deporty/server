"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMainDrawNodeMatchesoverviewusecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetMainDrawNodeMatchesoverviewusecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getMainDrawNodeMatchesOverview(tournamentId);
    }
}
exports.GetMainDrawNodeMatchesoverviewusecase = GetMainDrawNodeMatchesoverviewusecase;
