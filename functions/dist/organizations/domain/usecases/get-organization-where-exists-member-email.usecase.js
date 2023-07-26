"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrganizationWhereExistsMemberEmailUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
const operators_1 = require("rxjs/operators");
class GetOrganizationWhereExistsMemberEmailUsecase extends usecase_1.Usecase {
    constructor(userContract, getOrganizationWhereExistsMemberIdUsecase) {
        super();
        this.userContract = userContract;
        this.getOrganizationWhereExistsMemberIdUsecase = getOrganizationWhereExistsMemberIdUsecase;
    }
    call(email) {
        return this.userContract.getUserInformationByEmail(email).pipe((0, operators_1.mergeMap)((user) => {
            return this.getOrganizationWhereExistsMemberIdUsecase.call(user.id);
        }));
    }
}
exports.GetOrganizationWhereExistsMemberEmailUsecase = GetOrganizationWhereExistsMemberEmailUsecase;
