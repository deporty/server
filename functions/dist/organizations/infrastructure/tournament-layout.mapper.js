"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentLayoutMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../core/mapper");
class TournamentLayoutMapper extends mapper_1.Mapper {
    constructor(fileAdapter) {
        super();
        this.fileAdapter = fileAdapter;
        this.attributesMapper = {
            categories: { name: 'categories' },
            description: { name: 'NTP' },
            tags: { name: 'tags' },
            name: { name: 'name' },
            organizationId: { name: 'organization-id' },
            flayer: {
                name: 'flayer',
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
exports.TournamentLayoutMapper = TournamentLayoutMapper;
