"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveGroupUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
const tournaments_exceptions_1 = require("../../../tournaments.exceptions");
class SaveGroupUsecase extends usecase_1.Usecase {
    constructor(getGroupByLabelUsecase, groupContract) {
        super();
        this.getGroupByLabelUsecase = getGroupByLabelUsecase;
        this.groupContract = groupContract;
    }
    call(param) {
        const params = {
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupLabel: param.group.label,
        };
        if (!param.group.label) {
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.LabelMustBeProvidedError());
        }
        if (param.group.order === undefined || param.group.order === null) {
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.OrderMustBeProvidedError());
        }
        return this.getGroupByLabelUsecase.call(params).pipe((0, operators_1.mergeMap)((group) => {
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.GroupAlreadyExistsError(group.label, 'label'));
        }), (0, operators_1.catchError)((error) => {
            if (error instanceof tournaments_exceptions_1.GroupDoesNotExist) {
                const group = Object.assign(Object.assign({}, param.group), { teamIds: [] });
                return this.groupContract
                    .save({
                    tournamentId: param.tournamentId,
                    fixtureStageId: param.fixtureStageId,
                }, group)
                    .pipe((0, operators_1.map)((id) => {
                    return Object.assign(Object.assign({}, param.group), { id });
                }));
            }
            else {
                return (0, rxjs_1.throwError)(error);
            }
        }));
    }
}
exports.SaveGroupUsecase = SaveGroupUsecase;
