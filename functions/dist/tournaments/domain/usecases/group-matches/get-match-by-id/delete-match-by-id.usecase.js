"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMatchByIdUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
class DeleteMatchByIdUsecase extends usecase_1.Usecase {
    constructor(matchContract) {
        super();
        this.matchContract = matchContract;
    }
    call(param) {
        return this.
        ;
        return this.matchContract.delete(param).pipe(map);
    }
}
exports.DeleteMatchByIdUsecase = DeleteMatchByIdUsecase;
