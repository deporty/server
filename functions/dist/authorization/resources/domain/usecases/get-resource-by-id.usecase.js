"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetResourceByIdUsecase = exports.ResourceDoesNotExistException = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class ResourceDoesNotExistException extends Error {
    constructor(email) {
        super();
        this.message = `The resource with the id "${email}" does not exist.`;
        this.name = 'ResourceDoesNotExistException';
    }
}
exports.ResourceDoesNotExistException = ResourceDoesNotExistException;
class GetResourceByIdUsecase extends usecase_1.Usecase {
    constructor(resourceContract) {
        super();
        this.resourceContract = resourceContract;
    }
    call(id) {
        return this.resourceContract.getById(id).pipe((0, operators_1.mergeMap)((user) => {
            if (!user) {
                return (0, rxjs_1.throwError)(new ResourceDoesNotExistException(id));
            }
            return (0, rxjs_1.of)(user);
        }));
    }
}
exports.GetResourceByIdUsecase = GetResourceByIdUsecase;
