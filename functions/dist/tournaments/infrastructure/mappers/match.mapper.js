"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMapper = exports.RefereeInMatchMapper = void 0;
const rxjs_1 = require("rxjs");
const mapper_1 = require("../../../core/mapper");
class RefereeInMatchMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            refereeId: { name: 'referee-id' },
            rol: { name: 'rol' },
        };
    }
}
exports.RefereeInMatchMapper = RefereeInMatchMapper;
class MatchMapper extends mapper_1.Mapper {
    constructor(scoreMapper, playFormMapper, stadisticsMapper, refereeInMatchMapper, fileAdapter) {
        super();
        this.scoreMapper = scoreMapper;
        this.playFormMapper = playFormMapper;
        this.stadisticsMapper = stadisticsMapper;
        this.refereeInMatchMapper = refereeInMatchMapper;
        this.fileAdapter = fileAdapter;
        this.attributesMapper = {
            id: { name: 'id' },
            score: {
                name: 'score',
                to: (value) => {
                    return this.scoreMapper.toJson(value);
                },
                from: (value) => {
                    return this.scoreMapper.fromJson(value);
                },
            },
            stadistics: {
                name: 'stadistics',
                to: (value) => {
                    return value ? this.stadisticsMapper.toJson(value) : undefined;
                },
                from: (value) => {
                    return this.stadisticsMapper.fromJson(value);
                },
            },
            playerForm: {
                name: 'player-form',
                to: (value) => {
                    return value ? this.playFormMapper.toJson(value) : undefined;
                },
                from: (value) => {
                    return value ? this.playFormMapper.fromJson(value) : (0, rxjs_1.of)(undefined);
                },
            },
            teamAId: { name: 'team-a-id' },
            teamBId: { name: 'team-b-id' },
            date: { name: 'date', from: (date) => (0, rxjs_1.of)(date.toDate()) },
            observations: { name: 'observations' },
            captainASignature: {
                name: 'captain-a-signature',
                from: (value) => {
                    return this.fileAdapter.getAbsoluteHTTPUrl(value);
                },
            },
            captainBSignature: {
                name: 'captain-b-signature',
                from: (value) => {
                    return this.fileAdapter.getAbsoluteHTTPUrl(value);
                },
            },
            judgeSignature: {
                name: 'judge-signature',
                from: (value) => {
                    return this.fileAdapter.getAbsoluteHTTPUrl(value);
                },
            },
            status: { name: 'status' },
            locationId: { name: 'location-id' },
            refereeIds: {
                name: 'referee-ids',
                from: (value) => {
                    return value.length > 0
                        ? (0, rxjs_1.zip)(...value.map((x) => this.refereeInMatchMapper.fromJson(x)))
                        : (0, rxjs_1.of)([]);
                },
                to: (values) => {
                    return values.map((x) => this.refereeInMatchMapper.toJson(x));
                },
            },
            playground: { name: 'playground' },
        };
    }
}
exports.MatchMapper = MatchMapper;
