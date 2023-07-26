"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditMatchToGroupInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const match_helper_1 = require("../../helpers/match.helper");
const edit_match_to_group_inside_tournament_exceptions_1 = require("./edit-match-to-group-inside-tournament.exceptions");
class EditMatchToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, updateTournamentUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
    }
    call(param) {
        const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
        return $tournament.pipe((0, operators_1.catchError)((error) => (0, rxjs_1.throwError)(error)), (0, operators_1.map)((tournament) => {
            var _a;
            const stage = (_a = tournament.fixture) === null || _a === void 0 ? void 0 : _a.stages.filter((stage) => stage.id == param.stageId);
            if ((stage === null || stage === void 0 ? void 0 : stage.length) === 0) {
                return (0, rxjs_1.throwError)(new edit_match_to_group_inside_tournament_exceptions_1.StageDoesNotExist(param.stageId));
            }
            const currentStage = stage.pop();
            const group = currentStage.groups.filter((g) => g.order == param.groupIndex);
            if (group.length === 0) {
                return (0, rxjs_1.throwError)(new edit_match_to_group_inside_tournament_exceptions_1.GroupDoesNotExist(param.groupIndex));
            }
            const currentGroup = group.pop();
            console.log('El current group es ');
            console.log(currentGroup);
            if (!currentGroup.matches) {
                currentGroup.matches = [];
            }
            console.log('...');
            console.log(param.match);
            console.log('...');
            console.log(currentGroup.matches);
            console.log('...');
            const exist = (0, match_helper_1.existSMatchInList)(param.match, currentGroup.matches);
            if (!exist) {
                return (0, rxjs_1.throwError)(new edit_match_to_group_inside_tournament_exceptions_1.MatchDoesNotExist());
            }
            else {
                const index = (0, match_helper_1.findMatchInList)(param.match, currentGroup.matches);
                currentGroup.matches[index] = param.match;
            }
            console.log();
            console.log();
            console.log('Final');
            console.log(currentGroup.matches);
            console.log();
            console.log();
            return this.updateTournamentUsecase.call(tournament).pipe((0, operators_1.map)((t) => {
                return currentStage;
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.EditMatchToGroupInsideTournamentUsecase = EditMatchToGroupInsideTournamentUsecase;
