"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRegisteredTeamsByTournamentIdUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
class GetRegisteredTeamsByTournamentIdUsecase extends usecase_1.Usecase {
    constructor(registeredTeamsContract) {
        super();
        this.registeredTeamsContract = registeredTeamsContract;
    }
    call(tournamentId) {
        return this.registeredTeamsContract.filter({
            tournamentId,
        }, {
            tournamentId: {
                operator: '==',
                value: tournamentId,
            },
        });
    }
}
exports.GetRegisteredTeamsByTournamentIdUsecase = GetRegisteredTeamsByTournamentIdUsecase;
