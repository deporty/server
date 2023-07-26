"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchByIdUsecase = exports.MatchDoesNotExistError = void 0;
const usecase_1 = require("../../../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class MatchDoesNotExistError extends Error {
    constructor(id) {
        super();
        this.message = `The Match with the id ${id} does not exist`;
        this.name = 'MatchDoesNotExistError';
    }
}
exports.MatchDoesNotExistError = MatchDoesNotExistError;
class GetMatchByIdUsecase extends usecase_1.Usecase {
    constructor(matchContract) {
        super();
        this.matchContract = matchContract;
    }
    call(param) {
        return this.matchContract
            .getById({
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
            tournamentId: param.tournamentId,
            matchId: param.matchId,
        }, param.matchId)
            .pipe((0, operators_1.mergeMap)((match) => {
            if (!match) {
                return (0, rxjs_1.throwError)(new MatchDoesNotExistError(param.matchId));
            }
            return (0, rxjs_1.of)(match);
        }));
    }
}
exports.GetMatchByIdUsecase = GetMatchByIdUsecase;
