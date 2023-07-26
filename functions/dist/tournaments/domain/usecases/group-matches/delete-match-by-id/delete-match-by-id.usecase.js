"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMatchByIdUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
const operators_1 = require("rxjs/operators");
class DeleteMatchByIdUsecase extends usecase_1.Usecase {
    constructor(matchContract, getMatchByIdUsecase) {
        super();
        this.matchContract = matchContract;
        this.getMatchByIdUsecase = getMatchByIdUsecase;
    }
    call(param) {
        return this.getMatchByIdUsecase.call(param).pipe((0, operators_1.mergeMap)((match) => {
            return this.matchContract
                .delete(param, param.matchId)
                .pipe((0, operators_1.map)((x) => match));
        }));
    }
}
exports.DeleteMatchByIdUsecase = DeleteMatchByIdUsecase;
