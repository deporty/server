"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const user_exceptions_1 = require("../../user.exceptions");
class GetUserByIdUsecase extends usecase_1.Usecase {
    constructor(userContract) {
        super();
        this.userContract = userContract;
    }
    call(id) {
        return this.userContract.getById(id).pipe((0, operators_1.mergeMap)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new user_exceptions_1.UserDoesNotExistException('id', id));
            }
            return (0, rxjs_1.of)(user);
        }));
    }
}
exports.GetUserByIdUsecase = GetUserByIdUsecase;
