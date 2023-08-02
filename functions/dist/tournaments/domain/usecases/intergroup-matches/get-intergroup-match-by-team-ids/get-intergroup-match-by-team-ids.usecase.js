"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIntergroupMatchByTeamIdsUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class GetIntergroupMatchByTeamIdsUsecase extends usecase_1.Usecase {
    constructor(intergroupMatchContract) {
        super();
        this.intergroupMatchContract = intergroupMatchContract;
    }
    call(param) {
        return this.intergroupMatchContract
            .get({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
        })
            .pipe((0, operators_1.map)((entity) => {
            return entity
                .filter((x) => {
                return ((x.match.teamAId == param.teamAId && x.match.teamBId == param.teamBId) ||
                    (x.match.teamAId == param.teamBId && x.match.teamBId == param.teamAId));
            })
                .pop();
        }));
    }
}
exports.GetIntergroupMatchByTeamIdsUsecase = GetIntergroupMatchByTeamIdsUsecase;
