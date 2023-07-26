"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetIntergroupMatchesUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class GetIntergroupMatchesUsecase extends usecase_1.Usecase {
    constructor(intergroupMatchContract) {
        super();
        this.intergroupMatchContract = intergroupMatchContract;
    }
    call(param) {
        return this.intergroupMatchContract
            .get({
            fixtureStageId: param.fixtureStageId,
            tournamentId: param.tournamentId,
        })
            .pipe((0, operators_1.map)((matches) => {
            return matches.filter((m) => {
                return param.states.includes(m.match.status);
            });
        }));
    }
}
exports.GetIntergroupMatchesUsecase = GetIntergroupMatchesUsecase;
