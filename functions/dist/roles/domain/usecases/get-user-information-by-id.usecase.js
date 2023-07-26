"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserInformationByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rxjs_helpers_1 = require("../../../core/rxjs.helpers");
const usecase_1 = require("../../../core/usecase");
const user_exceptions_1 = require("../user.exceptions");
class GetUserInformationByIdUsecase extends usecase_1.Usecase {
    constructor(userContract) {
        super();
        this.userContract = userContract;
    }
    call(id) {
        return this.userContract.getById(id).pipe((0, operators_1.map)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new user_exceptions_1.UserDoesNotExistException(id));
            }
            return (0, rxjs_1.of)(user);
        }), (0, operators_1.mergeMap)((x) => x), (0, rxjs_helpers_1.catchAndThrow)());
    }
}
exports.GetUserInformationByIdUsecase = GetUserInformationByIdUsecase;
