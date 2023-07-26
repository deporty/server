"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFixtureOverviewByTournamentUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
class GetFixtureOverviewByTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getFixtureOverviewByTournamentId(tournamentId);
    }
}
exports.GetFixtureOverviewByTournamentUsecase = GetFixtureOverviewByTournamentUsecase;
