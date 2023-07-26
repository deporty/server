"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchInsideGroup = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const tournaments_exceptions_1 = require("../../tournaments.exceptions");
class GetMatchInsideGroup extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(param) {
        return this.tournamentContract
            .getGroupMatchByTeams(param.tournamentId, param.stageId, param.groupLabel, param.teamAId, param.teamBId)
            .pipe((0, operators_1.map)((tournament) => {
            if (!tournament) {
                return (0, rxjs_1.throwError)(new tournaments_exceptions_1.MatchDoesNotExist());
            }
            return (0, rxjs_1.of)(tournament);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.GetMatchInsideGroup = GetMatchInsideGroup;
