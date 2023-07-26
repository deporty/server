"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessKeyMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../../../core/mapper");
class AccessKeyMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            id: { name: 'id' },
            name: { name: 'name' },
            description: { name: 'description' },
            key: { name: 'key' },
            expirationDate: {
                name: 'expiration-date',
                from: (date) => (date ? (0, rxjs_1.of)(date.toDate()) : (0, rxjs_1.of)(date)),
            },
        };
    }
}
exports.AccessKeyMapper = AccessKeyMapper;
