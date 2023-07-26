"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRepository = void 0;
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../core/helpers");
const user_constants_1 = require("../../users/infrastructure/user.constants");
const organization_contract_1 = require("../organization.contract");
const organization_constants_1 = require("./organization.constants");
class OrganizationRepository extends organization_contract_1.OrganizationContract {
    constructor(firestore, organizationMapper) {
        super();
        this.firestore = firestore;
        this.organizationMapper = organizationMapper;
    }
    getByMemberId(memberid) {
        const ref = this.firestore.collection(organization_constants_1.ORGANIZATIONS_ENTITY);
        const response = ref
            .where('members', 'array-contains-any', [this.firestore.collection(user_constants_1.USERS_ENTITY).doc(memberid)])
            .get();
        return (0, helpers_1.mapFromSnapshot)(response, this.organizationMapper.fromJson).pipe((0, operators_1.map)((data) => {
            return data && data.length == 1 ? data[0] : null;
        }));
    }
}
exports.OrganizationRepository = OrganizationRepository;
