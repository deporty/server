"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPositionsTableByGroupUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetPositionsTableByGroupUsecase extends usecase_1.Usecase {
    constructor(getGroupMatchesUsecase, getPositionsTableUsecase, getIntergroupMatchesUsecase, getGroupByIdUsecase) {
        super();
        this.getGroupMatchesUsecase = getGroupMatchesUsecase;
        this.getPositionsTableUsecase = getPositionsTableUsecase;
        this.getIntergroupMatchesUsecase = getIntergroupMatchesUsecase;
        this.getGroupByIdUsecase = getGroupByIdUsecase;
    }
    call(param) {
        return (0, rxjs_1.zip)(this.getGroupByIdUsecase.call(param), this.getGroupMatchesUsecase.call(Object.assign(Object.assign({}, param), { states: ['completed'] })), this.getIntergroupMatchesUsecase.call({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            states: ['completed'],
        })).pipe((0, operators_1.mergeMap)(([group, matches, intergroupMatches]) => {
            const fullMatches = [...matches];
            for (const inter of intergroupMatches) {
                if (group.teamIds.includes(inter.match.teamAId) ||
                    group.teamIds.includes(inter.match.teamBId)) {
                    fullMatches.push(inter.match);
                }
            }
            return this.getPositionsTableUsecase.call({
                matches: fullMatches,
                teamIds: group.teamIds,
            });
        }));
    }
}
exports.GetPositionsTableByGroupUsecase = GetPositionsTableByGroupUsecase;
