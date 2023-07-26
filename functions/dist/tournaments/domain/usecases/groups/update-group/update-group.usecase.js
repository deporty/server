"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
const tournaments_exceptions_1 = require("../../../tournaments.exceptions");
class UpdateGroupUsecase extends usecase_1.Usecase {
    constructor(getGroupByIdUsecase, groupContract) {
        super();
        this.getGroupByIdUsecase = getGroupByIdUsecase;
        this.groupContract = groupContract;
    }
    call(param) {
        const params = {
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.group.id,
        };
        if (!param.group.label) {
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.LabelMustBeProvidedError());
        }
        if (param.group.order == undefined || param.group.order == null) {
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.OrderMustBeProvidedError());
        }
        return this.getGroupByIdUsecase.call(params).pipe((0, operators_1.mergeMap)((group) => {
            const newGroup = Object.assign({}, group);
            newGroup.label = param.group.label;
            newGroup.order = param.group.order;
            newGroup.teamIds = param.group.teamIds;
            newGroup.positionsTable = param.group.positionsTable;
            return this.groupContract
                .update({
                tournamentId: param.tournamentId,
                fixtureStageId: param.fixtureStageId,
                groupId: param.group.id,
            }, newGroup)
                .pipe((0, operators_1.map)(() => {
                return newGroup;
            }));
        }));
    }
}
exports.UpdateGroupUsecase = UpdateGroupUsecase;
