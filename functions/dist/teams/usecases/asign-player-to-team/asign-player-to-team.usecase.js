"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignPlayerToTeamUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const asign_player_to_team_exceptions_1 = require("./asign-player-to-team.exceptions");
class AsignPlayerToTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract, getTeamByIdUsecase, getPlayerByIdUsecase, updateTournamentUsecase, getActiveTournamentsByRegisteredTeamUsecase) {
        super();
        this.teamContract = teamContract;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
        this.getPlayerByIdUsecase = getPlayerByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
        this.getActiveTournamentsByRegisteredTeamUsecase = getActiveTournamentsByRegisteredTeamUsecase;
    }
    call(param) {
        const $getPlayerByIdUsecase = this.getPlayerByIdUsecase.call(param.playerId);
        const $getTeamByIdUsecase = this.getTeamByIdUsecase.call(param.teamId);
        return (0, rxjs_1.zip)($getPlayerByIdUsecase, $getTeamByIdUsecase).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((_zip) => {
            const player = _zip[0];
            const team = _zip[1];
            if (team.members == undefined) {
                team.members = [];
            }
            const existsPlayer = team.members.filter((p) => {
                return p.player.id === player.id;
            }).length > 0;
            if (!existsPlayer) {
                const newMember = {
                    player,
                    initDate: new Date(),
                    number: param.number,
                    role: '',
                };
                team.members.push(newMember);
                const $tournamentsByRegisteredTeams = this.getActiveTournamentsByRegisteredTeamUsecase.call(team.id);
                const $teamUpdated = this.teamContract.update(team.id, team);
                return (0, rxjs_1.zip)($teamUpdated, $tournamentsByRegisteredTeams).pipe((0, operators_1.map)((data) => {
                    const tournaments = data[1];
                    const $tournamentsUpdated = [];
                    for (const tournament of tournaments) {
                        for (let j = 0; j < tournament.registeredTeams.length; j++) {
                            const registeredTeam = tournament.registeredTeams[j];
                            if (registeredTeam.team.id == team.id) {
                                if (!registeredTeam.team.members) {
                                    registeredTeam.team.members = [];
                                }
                                tournament.registeredTeams[j].members.push(newMember);
                            }
                        }
                        $tournamentsUpdated.push(this.updateTournamentUsecase.call(tournament));
                    }
                    if ($tournamentsUpdated.length > 0) {
                        return (0, rxjs_1.zip)(...$tournamentsUpdated).pipe((0, operators_1.map)(() => {
                            return newMember;
                        }));
                    }
                    else {
                        return (0, rxjs_1.of)(newMember);
                    }
                }), (0, operators_1.mergeMap)((x) => x));
            }
            else {
                return (0, rxjs_1.throwError)(new asign_player_to_team_exceptions_1.PlayerIsAlreadyInTeamException(player.document));
            }
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.AsignPlayerToTeamUsecase = AsignPlayerToTeamUsecase;
