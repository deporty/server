"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRepository = void 0;
const organization_contract_1 = require("../../domain/contracts/organization.contract");
const organizations_constants_1 = require("../organizations.constants");
class OrganizationRepository extends organization_contract_1.OrganizationContract {
    constructor(datasource, organizationMapper) {
        super(datasource, organizationMapper);
        this.datasource = datasource;
        this.organizationMapper = organizationMapper;
        this.entity = OrganizationRepository.entity;
    }
}
exports.OrganizationRepository = OrganizationRepository;
OrganizationRepository.entity = organizations_constants_1.ORGANIZATIONS_ENTITY;
