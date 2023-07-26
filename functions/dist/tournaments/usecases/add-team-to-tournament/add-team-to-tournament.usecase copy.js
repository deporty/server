"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTeamToTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class AddTeamToTournamentUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, getTeamByIdUsecase, updateTournamentUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
    }
    call(param) {
        const $team = this.getTeamByIdUsecase.call(param.teamId);
        const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
        return (0, rxjs_1.zip)($team, $tournament).pipe((0, operators_1.catchError)((error) => (0, rxjs_1.throwError)(error)), (0, operators_1.map)((data) => {
            const team = data[0];
            const tournament = data[1];
            const registeredTeams = tournament.registeredTeams;
            const exists = registeredTeams.filter((t) => t.team.id === team.id).length > 0;
            if (!exists) {
                tournament.registeredTeams.push({
                    enrollmentDate: new Date(),
                    members: team.members || [],
                    team: team,
                });
                return this.updateTournamentUsecase.call(tournament);
            }
            return (0, rxjs_1.of)();
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.AddTeamToTournamentUsecase = AddTeamToTournamentUsecase;
//# sourceMappingURL=add-team-to-tournament.usecase%20copy.js.map