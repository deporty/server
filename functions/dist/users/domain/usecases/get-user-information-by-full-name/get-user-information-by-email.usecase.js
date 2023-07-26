"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserInformationByEmailUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const user_exceptions_1 = require("../../user.exceptions");
class GetUserInformationByEmailUsecase extends usecase_1.Usecase {
    constructor(userContract) {
        super();
        this.userContract = userContract;
    }
    call(email) {
        return this.userContract.getByEmail(email).pipe((0, operators_1.map)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new user_exceptions_1.UserDoesNotExistException('email', email));
            }
            return (0, rxjs_1.of)(user);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.GetUserInformationByEmailUsecase = GetUserInformationByEmailUsecase;
