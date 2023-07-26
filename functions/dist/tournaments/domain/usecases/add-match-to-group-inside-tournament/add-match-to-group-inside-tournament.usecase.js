"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMatchToGroupInsideTournamentUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class AddMatchToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(param) {
        return this.tournamentContract.addMatchToGroupInsideTournament(param.tournamentId, param.stageId, param.groupIndex, param.teamAId, param.teamBId, param.date);
    }
}
exports.AddMatchToGroupInsideTournamentUsecase = AddMatchToGroupInsideTournamentUsecase;
