"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOrganizationsUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetOrganizationsUsecase extends usecase_1.Usecase {
    constructor(organizationContract) {
        super();
        this.organizationContract = organizationContract;
    }
    call(params) {
        return this.organizationContract.get({
            pageNumber: parseInt(params.pageNumber + ''),
            pageSize: parseInt(params.pageSize + ''),
        });
    }
}
exports.GetOrganizationsUsecase = GetOrganizationsUsecase;
