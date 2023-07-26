"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMapper = exports.PositionTableMapper = exports.LinearStadisticMapper = exports.FlatPointsStadisticsMapper = void 0;
const mapper_1 = require("../../../core/mapper");
const rxjs_1 = require("rxjs");
class FlatPointsStadisticsMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            playedMatches: { name: 'played-matches' },
            wonMatches: { name: 'won-matches' },
            fairPlay: { name: 'fair-play' },
            tiedMatches: { name: 'tied-matches' },
            lostMatches: { name: 'lost-matches' },
            goalsInFavor: { name: 'goals-in-favor' },
            goalsAgainst: { name: 'goals-against' },
            goalsDifference: { name: 'goals-difference' },
            goalsAgainstPerMatch: { name: 'goals-against-per-match' },
            points: { name: 'points' },
        };
    }
}
exports.FlatPointsStadisticsMapper = FlatPointsStadisticsMapper;
class LinearStadisticMapper extends mapper_1.Mapper {
    constructor(flatPointsStadisticsMapper) {
        super();
        this.flatPointsStadisticsMapper = flatPointsStadisticsMapper;
        this.attributesMapper = {
            teamId: { name: 'team-id' },
            wasByRandom: { name: 'was-by-random' },
            stadistics: {
                name: 'stadistics',
                from: (value) => {
                    return this.flatPointsStadisticsMapper.fromJson(value);
                },
                to: (value) => {
                    return this.flatPointsStadisticsMapper.toJson(value);
                },
            },
        };
    }
}
exports.LinearStadisticMapper = LinearStadisticMapper;
class PositionTableMapper extends mapper_1.Mapper {
    constructor(linearStadisticMapper) {
        super();
        this.linearStadisticMapper = linearStadisticMapper;
        this.attributesMapper = {
            table: {
                name: 'table',
                to: (values) => {
                    return values.length > 0
                        ? values.map((v) => this.linearStadisticMapper.toJson(v))
                        : [];
                },
                from: (values) => {
                    return values.length > 0
                        ? (0, rxjs_1.zip)(...values.map((v) => this.linearStadisticMapper.fromJson(v)))
                        : (0, rxjs_1.of)([]);
                },
            },
            analizedMatches: { name: 'analized-matches' },
        };
    }
}
exports.PositionTableMapper = PositionTableMapper;
class GroupMapper extends mapper_1.Mapper {
    constructor(positionTableMapper) {
        super();
        this.positionTableMapper = positionTableMapper;
        this.attributesMapper = {
            id: { name: 'id' },
            fixtureStageId: { name: 'fixture-stage-id' },
            label: { name: 'label' },
            order: { name: 'order' },
            teamIds: { name: 'teams' },
            positionsTable: {
                name: 'positions-table',
                from: (value) => {
                    return this.positionTableMapper.fromJson(value);
                },
                to: (value) => {
                    return this.positionTableMapper.toJson(value);
                },
            },
        };
    }
}
exports.GroupMapper = GroupMapper;
