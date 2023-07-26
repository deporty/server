"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMatchToGroupInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../core/helpers");
const usecase_1 = require("../../../core/usecase");
const match_helper_1 = require("../../helpers/match.helper");
const add_match_to_group_inside_tournament_exceptions_1 = require("./add-match-to-group-inside-tournament.exceptions");
class AddMatchToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, updateTournamentUsecase, getTeamByIdUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
    }
    call(param) {
        const $teamA = this.getTeamByIdUsecase.call(param.teamAId);
        const $teamB = this.getTeamByIdUsecase.call(param.teamBId);
        const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
        return (0, rxjs_1.zip)($tournament, $teamA, $teamB).pipe((0, operators_1.catchError)((error) => (0, rxjs_1.throwError)(error)), (0, operators_1.map)((data) => {
            var _a, _b;
            const tournament = data[0];
            const match = {
                teamA: data[1],
                teamB: data[2],
                date: param.date ? (0, helpers_1.getDateFromSeconds)(param.date) : undefined,
            };
            const stage = (_a = tournament.fixture) === null || _a === void 0 ? void 0 : _a.stages.filter((stage) => stage.id == param.stageId);
            if ((stage === null || stage === void 0 ? void 0 : stage.length) === 0) {
                return (0, rxjs_1.throwError)(new add_match_to_group_inside_tournament_exceptions_1.StageDoesNotExist(param.stageId));
            }
            const currentStage = stage.pop();
            const group = currentStage.groups.filter((g) => g.index === param.groupIndex);
            if (group.length === 0) {
                return (0, rxjs_1.throwError)(new add_match_to_group_inside_tournament_exceptions_1.GroupDoesNotExist(param.groupIndex));
            }
            const currentGroup = group.pop();
            if (!!currentGroup.matches) {
                currentGroup.matches = [];
            }
            const exist = (0, match_helper_1.existSMatchInList)(match, currentGroup.matches);
            if (!exist) {
                (_b = currentGroup.matches) === null || _b === void 0 ? void 0 : _b.push(match);
            }
            else {
                return (0, rxjs_1.throwError)(new add_match_to_group_inside_tournament_exceptions_1.MatchWasAlreadyRegistered(match));
            }
            return this.updateTournamentUsecase.call(tournament).pipe((0, operators_1.map)((t) => {
                return currentStage;
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.AddMatchToGroupInsideTournamentUsecase = AddMatchToGroupInsideTournamentUsecase;
