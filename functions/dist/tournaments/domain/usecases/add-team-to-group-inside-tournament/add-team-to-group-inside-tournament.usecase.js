"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTeamToGroupInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class AddTeamToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, getTeamByIdUsecase, updateTournamentUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
    }
    call(param) {
        const $team = this.getTeamByIdUsecase.call(param.teamId);
        const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
        return (0, rxjs_1.zip)($team, $tournament).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((data) => {
            var _a, _b;
            const team = data[0];
            if (((_a = team.members) === null || _a === void 0 ? void 0 : _a.length) == 0) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.TeamDoesNotHaveMembers(team.name));
            }
            const tournament = data[1];
            const stage = (_b = tournament.fixture) === null || _b === void 0 ? void 0 : _b.stages.filter((stage) => stage.id == param.stageId);
            if ((stage === null || stage === void 0 ? void 0 : stage.length) === 0) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.StageDoesNotExist(param.stageId));
            }
            const currentStage = stage.pop();
            const group = currentStage.groups.filter((g) => g.order == param.groupIndex);
            const otherGroup = currentStage.groups.filter((g) => g.order != param.groupIndex);
            if (group.length === 0) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.GroupDoesNotExist(param.groupIndex));
            }
            const currentGroup = group.pop();
            const exists = currentGroup.teams.filter((x) => x.id === team.id).length > 0;
            if (exists) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.TeamIsAlreadyInTheGroup(team.name));
            }
            let isInAnotherGroup = false;
            for (const g of otherGroup) {
                isInAnotherGroup =
                    isInAnotherGroup ||
                        g.teams.filter((x) => x.id === team.id).length > 0;
            }
            if (isInAnotherGroup) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.TeamIsAlreadyInOtherGroup(team.name));
            }
            currentGroup.teams.push(team);
            return this.updateTournamentUsecase.call(tournament).pipe((0, operators_1.map)((data) => {
                return currentGroup;
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.AddTeamToGroupInsideTournamentUsecase = AddTeamToGroupInsideTournamentUsecase;
