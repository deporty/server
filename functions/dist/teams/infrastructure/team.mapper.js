"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMapper = void 0;
const mapper_1 = require("../../core/mapper");
class TeamMapper extends mapper_1.Mapper {
    constructor(fileAdapter) {
        super();
        this.fileAdapter = fileAdapter;
        this.attributesMapper = {
            name: { name: 'name' },
            id: { name: 'id' },
            athem: { name: 'athem' },
            category: { name: 'category' },
            sportIds: { name: 'sport-ids' },
            miniShield: {
                name: 'mini-shield',
                from: (value) => {
                    return this.fileAdapter.getAbsoluteHTTPUrl(value);
                },
            },
            shield: {
                name: 'shield',
                from: (value) => {
                    return this.fileAdapter.getAbsoluteHTTPUrl(value);
                },
            },
        };
    }
}
exports.TeamMapper = TeamMapper;
