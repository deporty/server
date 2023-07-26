"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserInformationByEmailUsecase = void 0;
const usecase_1 = require("../../core/usecase");
class GetUserInformationByEmailUsecase extends usecase_1.Usecase {
    constructor(userContract) {
        super();
        this.userContract = userContract;
    }
    call(email) {
        return this.userContract.getByEmail(email);
    }
}
exports.GetUserInformationByEmailUsecase = GetUserInformationByEmailUsecase;
