"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFixtureStagesByTournamentUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
class GetFixtureStagesByTournamentUsecase extends usecase_1.Usecase {
    constructor(fixtureStageContract) {
        super();
        this.fixtureStageContract = fixtureStageContract;
    }
    call(tournamentId) {
        return this.fixtureStageContract.get({
            tournamentId,
        });
    }
}
exports.GetFixtureStagesByTournamentUsecase = GetFixtureStagesByTournamentUsecase;
