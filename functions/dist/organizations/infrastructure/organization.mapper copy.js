"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../core/mapper");
class OrganizationMapper extends mapper_1.Mapper {
    constructor(fileAdapter) {
        super();
        this.fileAdapter = fileAdapter;
        this.attributesMapper = {
            FMTA: { name: 'FMTA' },
            NTP: { name: 'NTP' },
            members: { name: 'members' },
            name: { name: 'name' },
            businessName: { name: 'business-name' },
            iso: {
                name: 'iso',
                from: (value) => {
                    return value
                        ? this.fileAdapter.getAbsoluteHTTPUrl(value)
                        : (0, rxjs_1.of)(undefined);
                },
            },
            id: { name: 'id' },
        };
    }
}
exports.OrganizationMapper = OrganizationMapper;
