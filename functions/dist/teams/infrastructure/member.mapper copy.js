"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../core/mapper");
class MemberMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            position: { name: 'position', default: '' },
            initDate: {
                name: 'init-date',
                from: (date) => (date ? (0, rxjs_1.of)(date.toDate()) : (0, rxjs_1.of)(date)),
            },
            number: { name: 'number' },
            retirementDate: {
                name: 'retirement-date',
                default: null,
                from: (date) => date != null ? (0, rxjs_1.of)(date.toDate()) : (0, rxjs_1.of)(date),
            },
            teamId: { name: 'team-id' },
            userId: { name: 'user-id' },
            kindMember: { name: 'kind-member', default: 'player' },
            id: { name: 'id' },
        };
    }
}
exports.MemberMapper = MemberMapper;
