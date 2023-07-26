"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrganizationWhereExistsMemberId = void 0;
const usecase_1 = require("../../core/usecase");
class GetOrganizationWhereExistsMemberId extends usecase_1.Usecase {
    constructor(organizationContract) {
        super();
        this.organizationContract = organizationContract;
    }
    call(memberid) {
        return this.organizationContract.getByMemberId(memberid);
    }
}
exports.GetOrganizationWhereExistsMemberId = GetOrganizationWhereExistsMemberId;
