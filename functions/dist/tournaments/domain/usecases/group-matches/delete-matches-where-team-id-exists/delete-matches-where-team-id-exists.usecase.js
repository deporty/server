"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMatchesWhereTeamIdExistsUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class DeleteMatchesWhereTeamIdExistsUsecase extends usecase_1.Usecase {
    constructor(getGroupMatchesUsecase, deleteMatchByIdUsecase) {
        super();
        this.getGroupMatchesUsecase = getGroupMatchesUsecase;
        this.deleteMatchByIdUsecase = deleteMatchByIdUsecase;
    }
    call(param) {
        return this.getGroupMatchesUsecase
            .call({
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
            tournamentId: param.tournamentId,
            states: ['completed', 'editing', 'published'],
        })
            .pipe((0, operators_1.mergeMap)((matches) => {
            const matchesWhereExists = [];
            for (const match of matches) {
                if (match.teamAId == param.teamId ||
                    match.teamBId == param.teamId) {
                    matchesWhereExists.push(match);
                }
            }
            return (0, rxjs_1.of)(matchesWhereExists);
        }), (0, operators_1.mergeMap)((matches) => {
            const deleted = [];
            for (const match of matches) {
                deleted.push(this.deleteMatchByIdUsecase.call({
                    fixtureStageId: param.fixtureStageId,
                    groupId: param.groupId,
                    matchId: match.id,
                    tournamentId: param.tournamentId,
                }));
            }
            return deleted.length == 0 ? (0, rxjs_1.of)([]) : (0, rxjs_1.zip)(...deleted);
        }));
    }
}
exports.DeleteMatchesWhereTeamIdExistsUsecase = DeleteMatchesWhereTeamIdExistsUsecase;
