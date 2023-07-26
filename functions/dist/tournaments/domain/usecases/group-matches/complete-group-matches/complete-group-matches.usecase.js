"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteGroupMatchesUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class CompleteGroupMatchesUsecase extends usecase_1.Usecase {
    constructor(getNewMatchesToAddInGroupUsecase, addMatchToGroupInsideTournamentUsecase) {
        super();
        this.getNewMatchesToAddInGroupUsecase = getNewMatchesToAddInGroupUsecase;
        this.addMatchToGroupInsideTournamentUsecase = addMatchToGroupInsideTournamentUsecase;
    }
    call(param) {
        return this.getNewMatchesToAddInGroupUsecase.call(param).pipe((0, operators_1.mergeMap)((newMatches) => {
            const temp = [];
            for (const match of newMatches) {
                temp.push(this.addMatchToGroupInsideTournamentUsecase.call({
                    fixtureStageId: param.fixtureStageId,
                    groupId: param.groupId,
                    tournamentId: param.tournamentId,
                    teamAId: match.teamAId,
                    teamBId: match.teamBId,
                }));
            }
            return temp.length == 0
                ? (0, rxjs_1.of)(void 0)
                : (0, rxjs_1.zip)(...temp).pipe((0, operators_1.map)((x) => void 0));
        }));
    }
}
exports.CompleteGroupMatchesUsecase = CompleteGroupMatchesUsecase;
