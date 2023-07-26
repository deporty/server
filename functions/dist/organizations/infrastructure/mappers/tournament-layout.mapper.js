"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentLayoutMapper = exports.FixtureStagesConfigurationMapper = exports.NegativePointsPerCardMapper = exports.PointsConfigurationMapper = exports.FixtureStageConfigurationMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../../core/mapper");
const organizations_1 = require("@deporty-org/entities/organizations");
class FixtureStageConfigurationMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            passedTeamsCount: {
                name: 'passed-teams-count',
            },
            groupCount: {
                name: 'group-count',
            },
            groupSize: {
                name: 'group-size',
            },
        };
    }
}
exports.FixtureStageConfigurationMapper = FixtureStageConfigurationMapper;
class PointsConfigurationMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            wonMatchPoints: {
                name: 'won-match-points',
            },
            tieMatchPoints: {
                name: 'tie-match-points',
            },
            lostMatchPoints: {
                name: 'lost-match-points',
            },
        };
    }
}
exports.PointsConfigurationMapper = PointsConfigurationMapper;
class NegativePointsPerCardMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            yellowCardsNegativePoints: {
                name: 'yellow-cards-negative-points',
            },
            redCardsNegativePoints: {
                name: 'red-cards-negative-points',
            },
        };
    }
}
exports.NegativePointsPerCardMapper = NegativePointsPerCardMapper;
class FixtureStagesConfigurationMapper extends mapper_1.Mapper {
    constructor(negativePointsPerCardMapper, fixtureStageConfigurationMapper, pointsConfigurationMapper) {
        super();
        this.negativePointsPerCardMapper = negativePointsPerCardMapper;
        this.fixtureStageConfigurationMapper = fixtureStageConfigurationMapper;
        this.pointsConfigurationMapper = pointsConfigurationMapper;
        this.attributesMapper = {
            negativePointsPerCard: {
                name: 'negative-points-per-card',
                default: organizations_1.DEFAULT_NEGATIVE_POINTS_PER_CARD_CONFIGURATION,
                from: (value) => {
                    return this.negativePointsPerCardMapper.fromJson(value);
                },
                to: (value) => {
                    console.log("Esta en el mapper negativo ", value);
                    return this.negativePointsPerCardMapper.toJson(value);
                },
            },
            stages: {
                name: 'stages',
                default: [],
                from: (value) => {
                    return value.length > 0
                        ? (0, rxjs_1.zip)(...value.map((x) => this.fixtureStageConfigurationMapper.fromJson(x)))
                        : (0, rxjs_1.of)([]);
                },
                to: (value) => {
                    return value.map((x) => this.fixtureStageConfigurationMapper.toJson(x));
                },
            },
            pointsConfiguration: {
                name: 'points-configuration',
                default: organizations_1.DEFAULT_POINTS_CONFIGURATION_CONFIGURATION,
                from: (value) => {
                    return this.pointsConfigurationMapper.fromJson(value);
                },
                to: (value) => {
                    return this.pointsConfigurationMapper.toJson(value);
                },
            },
            stadisticsOrder: {
                name: 'stadistics-order',
                default: organizations_1.DEFAULT_STADISTIS_KIND_CONFIGURATION,
            },
            tieBreakingOrder: {
                name: 'tie-breaking-order',
                default: organizations_1.DEFAULT_TIE_BREAKING_ORDER_CONFIGURATION,
            },
        };
    }
}
exports.FixtureStagesConfigurationMapper = FixtureStagesConfigurationMapper;
class TournamentLayoutMapper extends mapper_1.Mapper {
    constructor(fileAdapter, fixtureStagesConfigurationMapper) {
        super();
        this.fileAdapter = fileAdapter;
        this.fixtureStagesConfigurationMapper = fixtureStagesConfigurationMapper;
        this.attributesMapper = {
            categories: { name: 'categories' },
            description: { name: 'description' },
            passedTeamsCount: { name: 'passed-teams-count' },
            editions: { name: 'editions' },
            name: { name: 'name' },
            organizationId: { name: 'organization-id' },
            registeredTeamsVisibleStatus: { name: 'registered-teams-visible-status' },
            fixtureStagesConfiguration: {
                name: 'fixture-stages-configuration',
                default: organizations_1.DEFAULT_FIXTURE_STAGES_CONFIGURATION,
                from: (value) => {
                    return this.fixtureStagesConfigurationMapper.fromJson(value);
                },
                to: (value) => {
                    console.log("Layout::: ", value);
                    return this.fixtureStagesConfigurationMapper.toJson(value);
                },
            },
            flayer: {
                name: 'flayer',
                from: (value) => {
                    return value
                        ? this.fileAdapter.getAbsoluteHTTPUrl(value)
                        : (0, rxjs_1.of)(undefined);
                },
                to: (value) => {
                    return value ? this.fileAdapter.getRelativeUrl(value) : (0, rxjs_1.of)(undefined);
                },
            },
            id: { name: 'id' },
        };
    }
}
exports.TournamentLayoutMapper = TournamentLayoutMapper;
