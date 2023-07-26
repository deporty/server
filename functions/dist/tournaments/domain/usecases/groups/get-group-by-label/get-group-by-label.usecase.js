"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupByLabelUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
const tournaments_exceptions_1 = require("../../../tournaments.exceptions");
class GetGroupByLabelUsecase extends usecase_1.Usecase {
    constructor(groupContract) {
        super();
        this.groupContract = groupContract;
    }
    call(param) {
        return this.groupContract
            .filter({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
        }, {
            label: {
                operator: '==',
                value: param.groupLabel
            }
        })
            .pipe((0, operators_1.mergeMap)((group) => {
            if (!!group && group.length > 0) {
                return (0, rxjs_1.of)(group[0]);
            }
            return (0, rxjs_1.throwError)(new tournaments_exceptions_1.GroupDoesNotExist(param.groupLabel, 'label'));
        }));
    }
}
exports.GetGroupByLabelUsecase = GetGroupByLabelUsecase;
