"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserInformationByFullNameUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const user_exceptions_1 = require("../../user.exceptions");
class GetUserInformationByFullNameUsecase extends usecase_1.Usecase {
    constructor(userContract) {
        super();
        this.userContract = userContract;
    }
    call(params) {
        return this.userContract
            .filter({
            name: {
                operator: '==',
                value: params.names,
            },
            lastName: {
                operator: '==',
                value: params.lastNames,
            },
        })
            .pipe((0, operators_1.mergeMap)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new user_exceptions_1.UserDoesNotExistException('fullname', `${params.names} ${params.lastNames}`));
            }
            return (0, rxjs_1.of)(user);
        }));
    }
}
exports.GetUserInformationByFullNameUsecase = GetUserInformationByFullNameUsecase;
