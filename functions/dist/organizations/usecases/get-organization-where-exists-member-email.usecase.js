"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrganizationWhereExistsMemberEmail = void 0;
const usecase_1 = require("../../core/usecase");
class GetOrganizationWhereExistsMemberEmail extends usecase_1.Usecase {
    constructor(organizationContract, getUserInformationByEmailUsecase) {
        super();
        this.organizationContract = organizationContract;
        this.getUserInformationByEmailUsecase = getUserInformationByEmailUsecase;
    }
    call(email) {
        this.getUserInformationByEmailUsecase.call(email);
        return this.organizationContract.getByMemberId(email);
    }
}
exports.GetOrganizationWhereExistsMemberEmail = GetOrganizationWhereExistsMemberEmail;
