"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchByTeamIdsUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class GetMatchByTeamIdsUsecase extends usecase_1.Usecase {
    constructor(matchContract) {
        super();
        this.matchContract = matchContract;
    }
    call(param) {
        const $matchA = this.matchContract.filter({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
        }, {
            teamAId: {
                operator: '==',
                value: param.teamAId,
            },
            teamBId: {
                operator: '==',
                value: param.teamBId,
            },
        });
        const $matchB = this.matchContract.filter({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
        }, {
            teamBId: {
                operator: '==',
                value: param.teamAId,
            },
            teamAId: {
                operator: '==',
                value: param.teamBId,
            },
        });
        const $zipped = (0, rxjs_1.zip)($matchA, $matchB).pipe((0, operators_1.map)(([first, second]) => {
            const res = [...first, ...second];
            return res.pop();
        }));
        return $zipped;
    }
}
exports.GetMatchByTeamIdsUsecase = GetMatchByTeamIdsUsecase;
