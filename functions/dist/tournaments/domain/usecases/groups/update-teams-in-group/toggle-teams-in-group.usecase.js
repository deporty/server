"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleTeamsInGroupUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class ToggleTeamsInGroupUsecase extends usecase_1.Usecase {
    constructor(getGroupByIdUsecase, getTeamByIdUsecase, groupContract) {
        super();
        this.getGroupByIdUsecase = getGroupByIdUsecase;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
        this.groupContract = groupContract;
    }
    call(param) {
        const params = {
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
        };
        return this.getGroupByIdUsecase.call(params).pipe((0, operators_1.mergeMap)((group) => {
            return this.getTeamsStatusInner(param.teamIds, group.teamIds).pipe((0, operators_1.map)((status) => {
                return {
                    status,
                    group,
                };
            }));
        }), (0, operators_1.mergeMap)((data) => {
            const newGroup = Object.assign({}, data.group);
            return this.getTeamsStatusOuter(data.status).pipe((0, operators_1.map)((teamsStatus) => {
                return {
                    group: newGroup,
                    teamsStatus,
                };
            }));
        }), (0, operators_1.mergeMap)((data) => {
            console.log(data, 88);
            data.group.teamIds = data.teamsStatus
                .filter((x) => x.status === true)
                .map((x) => x.id);
            return this.groupContract
                .update({
                tournamentId: param.tournamentId,
                fixtureStageId: param.fixtureStageId,
                groupId: param.groupId,
            }, data.group)
                .pipe((0, operators_1.map)(() => {
                return data.group;
            }));
        }));
    }
    getTeamsStatusOuter(teamIds) {
        if (teamIds.length > 0) {
            return (0, rxjs_1.zip)(...teamIds.map((statusId) => {
                if (statusId.status === true) {
                    return (0, rxjs_1.of)(statusId);
                }
                return this.getTeamByIdUsecase.call(statusId.id).pipe((0, operators_1.catchError)((error) => {
                    return (0, rxjs_1.of)(null);
                }), (0, operators_1.map)((data) => {
                    return { status: !!data, id: statusId.id };
                }));
            }));
        }
        return (0, rxjs_1.of)([]);
    }
    getTeamsStatusInner(teamIds, previousTeamIds) {
        const newTeamIds = teamIds.map((teamId) => {
            return {
                id: teamId,
                status: previousTeamIds.includes(teamId) || 'unresolved',
            };
        });
        return (0, rxjs_1.of)(newTeamIds);
    }
}
exports.ToggleTeamsInGroupUsecase = ToggleTeamsInGroupUsecase;
