"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIntergroupMatchByTeamIdsUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class GetIntergroupMatchByTeamIdsUsecase extends usecase_1.Usecase {
    constructor(intergroupMatchContract) {
        super();
        this.intergroupMatchContract = intergroupMatchContract;
    }
    call(param) {
        const $matchA = this.intergroupMatchContract.filter({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
        }, {
            teamAId: {
                operator: '=',
                value: param.teamAId,
            },
            teamBId: {
                operator: '=',
                value: param.teamBId,
            },
        });
        const $matchB = this.intergroupMatchContract.filter({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
        }, {
            teamBId: {
                operator: '=',
                value: param.teamAId,
            },
            teamAId: {
                operator: '=',
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
exports.GetIntergroupMatchByTeamIdsUsecase = GetIntergroupMatchByTeamIdsUsecase;
