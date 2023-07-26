"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoleByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const permission_exceptions_1 = require("../permission.exceptions");
const usecase_1 = require("../../../../core/usecase");
class GetRoleByIdUsecase extends usecase_1.Usecase {
    constructor(roleContract) {
        super();
        this.roleContract = roleContract;
    }
    call(id) {
        return this.roleContract.getById(id).pipe((0, operators_1.mergeMap)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new permission_exceptions_1.RoleDoesNotExistException(id));
            }
            return (0, rxjs_1.of)(user);
        }));
    }
}
exports.GetRoleByIdUsecase = GetRoleByIdUsecase;
