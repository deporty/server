"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentMapper = void 0;
const mapper_1 = require("../../core/mapper");
class TournamentMapper extends mapper_1.Mapper {
    constructor(registeredTeamMapper, fixtureMapper, organizationMapper, financialStatementsMapper) {
        super();
        this.registeredTeamMapper = registeredTeamMapper;
        this.fixtureMapper = fixtureMapper;
        this.organizationMapper = organizationMapper;
        this.financialStatementsMapper = financialStatementsMapper;
    }
    fromJsonWithOutId(obj) {
        throw new Error('Method not implemented.');
    }
    toReferenceJson(obj) {
        throw new Error('Method not implemented.');
    }
    fromReferenceJson(obj) {
        return this.mapInsideReferences(obj);
    }
    fromJson(obj) {
        return {
            id: obj['id'],
            name: obj['name'],
            flayer: obj['flayer'] || '',
            category: obj['category'] || '',
            reward: obj['reward'] || [],
            status: obj['status'] || '',
            description: obj['description'] || '',
            inscription: obj['inscription'] || 0,
            startsDate: obj['starts-date'] || '',
            fixture: obj['fixture']
                ? this.fixtureMapper.fromJson(obj['fixture'])
                : undefined,
            registeredTeams: !!obj['registered-teams']
                ? obj['registered-teams'].map((x) => {
                    return this.registeredTeamMapper.fromJson(x);
                })
                : [],
            organization: this.organizationMapper.fromJson(obj['organization']),
            financialStatements: this.financialStatementsMapper.fromJson(obj['financial-statements']),
        };
    }
    toJson(obj) {
        return {
            id: obj.id,
            name: obj.name,
            flayer: obj.flayer,
            category: obj.category,
            'starts-date': obj.startsDate,
            reward: obj.reward,
            status: obj.status,
            description: obj.description,
            inscription: obj.inscription || 0,
            'registered-teams': !!obj.registeredTeams
                ? obj.registeredTeams.map((x) => {
                    return this.registeredTeamMapper.toJson(x);
                })
                : [],
            fixture: !!obj.fixture ? this.fixtureMapper.toJson(obj.fixture) : {},
            organization: !!obj.organization
                ? this.organizationMapper.toReferenceJson(obj.organization)
                : {},
            'financial-statements': this.financialStatementsMapper.toJson(obj.financialStatements),
        };
    }
}
exports.TournamentMapper = TournamentMapper;
