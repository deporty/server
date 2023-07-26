"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTeamsInGroupUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class DeleteTeamsInGroupUsecase extends usecase_1.Usecase {
    constructor(getGroupByIdUsecase, updateGroupUsecase, deleteMatchesWhereTeamIdExistsUsecase) {
        super();
        this.getGroupByIdUsecase = getGroupByIdUsecase;
        this.updateGroupUsecase = updateGroupUsecase;
        this.deleteMatchesWhereTeamIdExistsUsecase = deleteMatchesWhereTeamIdExistsUsecase;
    }
    call(param) {
        const params = {
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
        };
        return this.getGroupByIdUsecase.call(params).pipe((0, operators_1.mergeMap)((group) => {
            const newTeamIds = group.teamIds.filter((t) => {
                return !param.teamIds.includes(t);
            });
            group.teamIds = newTeamIds;
            const matchesPerTeam = [];
            let deletedMatches;
            for (const id of param.teamIds) {
                matchesPerTeam.push(this.deleteMatchesWhereTeamIdExistsUsecase.call({
                    fixtureStageId: param.fixtureStageId,
                    groupId: param.groupId,
                    teamId: id,
                    tournamentId: param.tournamentId,
                }));
            }
            deletedMatches =
                matchesPerTeam.length == 0 ? (0, rxjs_1.of)(void 0) : (0, rxjs_1.zip)(...matchesPerTeam);
            return (0, rxjs_1.zip)(deletedMatches, this.updateGroupUsecase.call(Object.assign(Object.assign({}, params), { group }))).pipe((0, operators_1.map)(() => {
                return group;
            }));
        }));
    }
}
exports.DeleteTeamsInGroupUsecase = DeleteTeamsInGroupUsecase;
