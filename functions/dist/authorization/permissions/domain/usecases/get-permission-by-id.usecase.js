"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPermissionByIdUsecase = exports.PermissionDoesNotExistException = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class PermissionDoesNotExistException extends Error {
    constructor(id) {
        super();
        this.message = `The permission with the id "${id}" does not exist.`;
        this.name = 'PermissionDoesNotExistException';
    }
}
exports.PermissionDoesNotExistException = PermissionDoesNotExistException;
class GetPermissionByIdUsecase extends usecase_1.Usecase {
    constructor(permissionContract) {
        super();
        this.permissionContract = permissionContract;
    }
    call(id) {
        return this.permissionContract.getById(id).pipe((0, operators_1.mergeMap)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new PermissionDoesNotExistException(id));
            }
            return (0, rxjs_1.of)(user);
        }));
    }
}
exports.GetPermissionByIdUsecase = GetPermissionByIdUsecase;
