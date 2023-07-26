"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoleByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const rxjs_helpers_1 = require("../../../core/rxjs.helpers");
const usecase_1 = require("../../../core/usecase");
const role_exceptions_1 = require("../role.exceptions");
class GetRoleByIdUsecase extends usecase_1.Usecase {
    constructor(roleContract) {
        super();
        this.roleContract = roleContract;
    }
    call(id) {
        return this.roleContract.getById(id).pipe((0, operators_1.map)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new role_exceptions_1.RoleDoesNotExistException(id));
            }
            return (0, rxjs_1.of)(user);
        }), (0, operators_1.mergeMap)((x) => x), (0, rxjs_helpers_1.catchAndThrow)());
    }
}
exports.GetRoleByIdUsecase = GetRoleByIdUsecase;
