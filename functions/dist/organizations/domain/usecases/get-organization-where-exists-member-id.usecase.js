"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrganizationWhereExistsMemberIdUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
class GetOrganizationWhereExistsMemberIdUsecase extends usecase_1.Usecase {
    constructor(organizationContract) {
        super();
        this.organizationContract = organizationContract;
    }
    call(memberid) {
        return this.organizationContract.filter({
            members: {
                operator: 'array-contains',
                value: memberid,
            },
        });
    }
}
exports.GetOrganizationWhereExistsMemberIdUsecase = GetOrganizationWhereExistsMemberIdUsecase;
