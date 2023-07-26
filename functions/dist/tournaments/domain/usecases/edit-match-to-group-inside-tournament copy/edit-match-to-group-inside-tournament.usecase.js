"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditMatchToGroupInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const match_helper_1 = require("../../../helpers/match.helper");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class EditMatchToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, updateTournamentUsecase, fileAdapter) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
        this.fileAdapter = fileAdapter;
    }
    convertToImage(param, match, indicative) {
        const signature = param.match[indicative];
        if (!!signature) {
            if (signature.startsWith('data:image')) {
                const imagePath = `tournaments/${param.tournamentId}/stages/${param.stageId}/groups/${param.groupIndex}/matches/${match.teamA.id}-${match.teamB.id}/${indicative}.jpg`;
                return this.fileAdapter
                    .uploadFile(imagePath, signature)
                    .pipe((0, operators_1.map)((x) => imagePath));
            }
            else {
                return (0, rxjs_1.of)(signature);
            }
        }
        return (0, rxjs_1.of)(undefined);
    }
    call(param) {
        const $tournament = this.getTournamentByIdUsecase.call(param.tournamentId);
        return $tournament.pipe((0, operators_1.catchError)((error) => (0, rxjs_1.throwError)(error)), (0, operators_1.map)((tournament) => {
            var _a;
            const stage = (_a = tournament.fixture) === null || _a === void 0 ? void 0 : _a.stages.filter((stage) => stage.id == param.stageId);
            if ((stage === null || stage === void 0 ? void 0 : stage.length) === 0) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.StageDoesNotExist(param.stageId));
            }
            const currentStage = stage.pop();
            const group = currentStage.groups.filter((g) => g.order == param.groupIndex);
            if (group.length === 0) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.GroupDoesNotExist(param.groupIndex));
            }
            const currentGroup = group.pop();
            if (!currentGroup.matches) {
                currentGroup.matches = [];
            }
            const exist = (0, match_helper_1.existSMatchInList)(param.match, currentGroup.matches);
            if (!exist) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.MatchDoesNotExist());
            }
            const index = (0, match_helper_1.findMatchInList)(param.match, currentGroup.matches);
            const signatures = [
                this.convertToImage(param, currentGroup.matches[index], 'captainASignature'),
                this.convertToImage(param, currentGroup.matches[index], 'captainBSignature'),
                this.convertToImage(param, currentGroup.matches[index], 'judgeSignature'),
            ];
            return (0, rxjs_1.zip)(...signatures).pipe((0, operators_1.map)((data) => {
                param.match.captainASignature = data[0];
                param.match.captainBSignature = data[1];
                param.match.judgeSignature = data[2];
                currentGroup.matches[index] = param.match;
                return this.updateTournamentUsecase.call(tournament).pipe((0, operators_1.map)((t) => {
                    return currentStage;
                }));
            }), (0, operators_1.mergeMap)((x) => x));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.EditMatchToGroupInsideTournamentUsecase = EditMatchToGroupInsideTournamentUsecase;
