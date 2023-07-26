"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersByRolUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetUsersByRolUsecase extends usecase_1.Usecase {
    constructor(userContract) {
        super();
        this.userContract = userContract;
    }
    call(params) {
        return this.userContract.get({
            pageNumber: params.pageNumber,
            pageSize: params.pageSize,
        });
    }
}
exports.GetUsersByRolUsecase = GetUsersByRolUsecase;
