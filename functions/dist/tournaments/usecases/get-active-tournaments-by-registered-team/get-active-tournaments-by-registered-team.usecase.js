"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveTournamentsByRegisteredTeamUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetActiveTournamentsByRegisteredTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract, tournamentContract) {
        super();
        this.teamContract = teamContract;
        this.tournamentContract = tournamentContract;
    }
    call(teamId) {
        return this.tournamentContract.get().pipe((0, operators_1.map)((tournaments) => {
            return tournaments.filter((tournament) => {
                return !!tournament.registeredTeams
                    ? tournament.registeredTeams.filter((x) => {
                        return x.team.id === teamId;
                    }).length > 0
                    : false && tournament.status == 'in progress';
            });
        }));
    }
}
exports.GetActiveTournamentsByRegisteredTeamUsecase = GetActiveTournamentsByRegisteredTeamUsecase;
//# sourceMappingURL=get-active-tournaments-by-registered-team.usecase.js.map