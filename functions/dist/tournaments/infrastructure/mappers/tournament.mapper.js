"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../../core/mapper");
class TournamentMapper extends mapper_1.Mapper {
    constructor(financialStatementsMapper, fileAdapter) {
        super();
        this.financialStatementsMapper = financialStatementsMapper;
        this.fileAdapter = fileAdapter;
        this.attributesMapper = {
            id: { name: 'id' },
            name: { name: 'name' },
            edition: { name: 'edition' },
            year: { name: 'year' },
            version: { name: 'version' },
            podium: { name: 'podium' },
            refereeIds: { name: 'referee-ids' },
            flayer: {
                name: 'flayer',
                from: (value) => {
                    return this.fileAdapter.getAbsoluteHTTPUrl(value);
                },
                to: (value) => {
                    return this.fileAdapter.getRelativeUrl(value);
                },
            },
            locations: { name: 'locations', default: [] },
            category: { name: 'category' },
            reward: { name: 'reward' },
            status: { name: 'status' },
            inscription: { name: 'inscription' },
            startsDate: {
                name: 'starts-date',
                from: (date) => (date ? (0, rxjs_1.of)(date.toDate()) : (0, rxjs_1.of)(date)),
            },
            organizationId: { name: 'organization-id' },
            tournamentLayoutId: { name: 'tournament-layout-id' },
            financialStatements: {
                name: 'financial-statements',
                from: (value) => {
                    return this.financialStatementsMapper.fromJson(value);
                },
            },
        };
    }
}
exports.TournamentMapper = TournamentMapper;
