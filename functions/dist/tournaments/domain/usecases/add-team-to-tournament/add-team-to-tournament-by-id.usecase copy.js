"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTeamToTournamentByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class AddTeamToTournamentByIdUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, getTeamByIdUsecase, calculateTournamentCostUsecase, calculateTournamentInvoices) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
        this.calculateTournamentCostUsecase = calculateTournamentCostUsecase;
        this.calculateTournamentInvoices = calculateTournamentInvoices;
    }
    call(param) {
        const $team = this.getTeamByIdUsecase.call(param.teamId);
        const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
        return (0, rxjs_1.zip)($team, $tournament).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((data) => {
            var _a;
            const team = data[0];
            if (((_a = team.members) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.TeamDoesNotHaveMembers(team.name));
            }
            const tournament = data[1];
            const registeredTeams = tournament.registeredTeams;
            const exists = registeredTeams.filter((t) => {
                return t.team.id === team.id;
            }).length > 0;
            if (!exists) {
                const registeredTeam = {
                    enrollmentDate: new Date(),
                    members: team.members || [],
                    team: team,
                };
                tournament.registeredTeams.push(registeredTeam);
                return this.calculateTournamentCostUsecase.call(tournament).pipe((0, operators_1.map)((data) => {
                    const tournament = data.tournament;
                    return this.calculateTournamentInvoices.call(tournament).pipe((0, operators_1.map)((data) => {
                        return registeredTeam;
                    }));
                }), (0, operators_1.mergeMap)((x) => x));
            }
            else {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.TeamWasAlreadyRegistered(team.name));
            }
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.AddTeamToTournamentByIdUsecase = AddTeamToTournamentByIdUsecase;
