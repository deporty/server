"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrganizationByIdUsecase = exports.OrganizationNotFoundError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class OrganizationNotFoundError extends Error {
    constructor() {
        super();
        this.name = 'OrganizationNotFoundError';
        this.message = `The organization was not found.`;
    }
}
exports.OrganizationNotFoundError = OrganizationNotFoundError;
class GetOrganizationByIdUsecase extends usecase_1.Usecase {
    constructor(organizationContract) {
        super();
        this.organizationContract = organizationContract;
    }
    call(id) {
        return this.organizationContract.getById(id).pipe((0, operators_1.mergeMap)((organization) => {
            if (!organization) {
                return (0, rxjs_1.throwError)(new OrganizationNotFoundError());
            }
            return (0, rxjs_1.of)(organization);
        }));
    }
}
exports.GetOrganizationByIdUsecase = GetOrganizationByIdUsecase;
