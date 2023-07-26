"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupMatchesUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
class GetGroupMatchesUsecase extends usecase_1.Usecase {
    constructor(matchContract) {
        super();
        this.matchContract = matchContract;
    }
    call(param) {
        const filters = {
            status: {
                operator: 'in',
                value: param.states || ['published'],
            },
        };
        return this.matchContract.filter({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
        }, filters);
    }
}
exports.GetGroupMatchesUsecase = GetGroupMatchesUsecase;
