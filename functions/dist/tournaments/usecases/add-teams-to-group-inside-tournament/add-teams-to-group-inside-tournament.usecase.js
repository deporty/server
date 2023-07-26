"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTeamsToGroupInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const add_match_to_group_inside_tournament_exceptions_1 = require("../add-match-to-group-inside-tournament/add-match-to-group-inside-tournament.exceptions");
const add_team_to_group_inside_tournament_exceptions_1 = require("../add-team-to-group-inside-tournament/add-team-to-group-inside-tournament.exceptions");
const add_team_to_group_inside_tournament_exceptions_2 = require("./add-team-to-group-inside-tournament.exceptions");
class AddTeamsToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, getTeamByIdUsecase, updateTournamentUsecase, addTeamToGroupInsideTournamentUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
        this.addTeamToGroupInsideTournamentUsecase = addTeamToGroupInsideTournamentUsecase;
    }
    call(param) {
        const $teams = param.teamIds.map((tid) => this.getTeamByIdUsecase.call(tid).pipe((0, operators_1.catchError)((x) => {
            return (0, rxjs_1.of)({
                teamId: tid,
                error: x,
            });
        }), (0, operators_1.tap)((data) => { })));
        return (0, rxjs_1.zip)(...$teams).pipe((0, operators_1.map)((data) => {
            var _a;
            const teams = data;
            const response = {};
            const newTeams = [];
            for (const team of teams) {
                if (!!team['teamId']) {
                    response[team['teamId']] = team['error'].message;
                }
                else {
                    if (((_a = team.members) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                        response[team.id] = new add_team_to_group_inside_tournament_exceptions_2.TeamDoesNotHaveMembers(team.name);
                    }
                    else {
                        newTeams.push(team);
                    }
                }
            }
            return {
                teams: response,
                group: {},
                newTeams,
            };
        }), (0, operators_1.map)((data) => {
            const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
            const $data = (0, rxjs_1.of)(data);
            return (0, rxjs_1.zip)($tournament, $data).pipe((0, operators_1.map)((res) => {
                return Object.assign({ tournament: res[0] }, res[1]);
            }));
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((data) => {
            var _a;
            const tournament = data['tournament'];
            const stage = (_a = tournament.fixture) === null || _a === void 0 ? void 0 : _a.stages.filter((stage) => stage.id == param.stageId);
            if ((stage === null || stage === void 0 ? void 0 : stage.length) === 0) {
                return (0, rxjs_1.throwError)(new add_match_to_group_inside_tournament_exceptions_1.StageDoesNotExist(param.stageId));
            }
            const currentStage = stage.pop();
            const group = currentStage.groups.filter((g) => g.order === param.groupIndex);
            if (group.length === 0) {
                return (0, rxjs_1.throwError)(new add_match_to_group_inside_tournament_exceptions_1.GroupDoesNotExist(param.groupIndex));
            }
            const currentGroup = group.pop();
            for (const team of data.newTeams) {
                const exists = currentGroup.teams.filter((x) => x.id === team.id).length > 0;
                if (exists) {
                    data.teams[team.id] = new add_team_to_group_inside_tournament_exceptions_1.TeamIsAlreadyInTheGroup(team.name).message;
                    // return throwError(new TeamIsAlreadyInTheGroup(team.name));
                }
                else {
                    const otherGroup = currentStage.groups.filter((g) => g.order != param.groupIndex);
                    let isInAnotherGroup = false;
                    for (const g of otherGroup) {
                        isInAnotherGroup =
                            isInAnotherGroup ||
                                g.teams.filter((x) => x.id === team.id).length > 0;
                    }
                    if (isInAnotherGroup) {
                        data.teams[team.id] = new add_team_to_group_inside_tournament_exceptions_2.TeamIsAlreadyInOtherGroup(team.name);
                    }
                    else {
                        currentGroup.teams.push(team);
                        data.teams[team.id] = 'SUCCESS';
                    }
                }
            }
            // return of({
            //   group: currentGroup,
            //   results: data.teams,
            //   tournament
            // });
            return this.updateTournamentUsecase.call(tournament).pipe((0, operators_1.map)((res) => {
                return {
                    group: currentGroup,
                    results: data.teams,
                };
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
    call2(param) {
        const $teamsAdded = param.teamIds.map((x) => {
            return this.addTeamToGroupInsideTournamentUsecase
                .call({
                tournamentId: param.tournamentId,
                stageId: param.stageId,
                groupIndex: param.groupIndex,
                teamId: x,
            })
                .pipe((0, operators_1.catchError)((x) => (0, rxjs_1.of)(x)), (0, operators_1.map)((g) => {
                return {
                    group: g,
                    teamId: x,
                };
            }));
        });
        return (0, rxjs_1.from)($teamsAdded).pipe((0, operators_1.mergeMap)((x) => x), (0, operators_1.reduce)((acc, x) => {
            console.log(x, 'Raibow');
            if (x.group instanceof Error) {
                acc.results[x.teamId] = x.group;
            }
            else {
                acc.results[x.teamId] = 'SUCCESS';
            }
            const tempo = acc.group.teams.filter((t) => t.id === x.teamId);
            const exists = tempo.length > 0;
            if (!exists) {
                acc.group.teams.push(tempo);
            }
            return acc;
        }, { group: { teams: [] }, results: {} }), (0, operators_1.map)((x) => x));
    }
}
exports.AddTeamsToGroupInsideTournamentUsecase = AddTeamsToGroupInsideTournamentUsecase;
