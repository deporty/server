"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationMapper = void 0;
const organization_constants_1 = require("./organization.constants");
class OrganizationMapper {
    constructor(db) {
        this.db = db;
    }
    fromJson(obj) {
        return {
            FMTA: obj['FMTA'],
            NTP: obj['NTP'],
            members: obj['members'],
            name: obj['name'],
            id: obj['id'],
        };
    }
    fromJsonWithOutId(obj) {
        throw new Error('Method not implemented.');
    }
    toJson(organization) {
        return {
            FMTA: organization.FMTA,
            NTP: organization.NTP,
            members: organization.members,
            name: organization.name,
        };
    }
    toReferenceJson(obj) {
        return this.db.collection(organization_constants_1.ORGANIZATIONS_ENTITY).doc(obj.id);
    }
    fromReferenceJson(obj) {
        throw new Error('Method not implemented.');
    }
}
exports.OrganizationMapper = OrganizationMapper;
