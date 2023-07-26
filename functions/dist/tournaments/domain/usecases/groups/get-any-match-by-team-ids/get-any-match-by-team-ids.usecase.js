"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAnyMatchByTeamIdsUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class GetAnyMatchByTeamIdsUsecase extends usecase_1.Usecase {
    constructor(getMatchByTeamIdsUsecase, getIntergroupMatchByTeamIdsUsecase) {
        super();
        this.getMatchByTeamIdsUsecase = getMatchByTeamIdsUsecase;
        this.getIntergroupMatchByTeamIdsUsecase = getIntergroupMatchByTeamIdsUsecase;
    }
    call(param) {
        const $groupMatches = this.getMatchByTeamIdsUsecase.call(param);
        const $intergroupMatches = this.getIntergroupMatchByTeamIdsUsecase.call(param);
        const $zipped = (0, rxjs_1.zip)($groupMatches, $intergroupMatches).pipe((0, operators_1.map)(([groupMatches, intergroupMatches]) => {
            if (intergroupMatches) {
                return intergroupMatches.match;
            }
            return groupMatches;
        }));
        return $zipped;
    }
}
exports.GetAnyMatchByTeamIdsUsecase = GetAnyMatchByTeamIdsUsecase;
