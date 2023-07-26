"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMapper = void 0;
const mapper_1 = require("../../../core/mapper");
const locations_constants_1 = require("../../../locations/infrastructure/locations.constants");
class MatchMapper extends mapper_1.Mapper {
    constructor(scoreMapper, teamMapper, stadisticsMapper, playerFormMapper, locationMapper, playgroundMapper, db) {
        super();
        this.scoreMapper = scoreMapper;
        this.teamMapper = teamMapper;
        this.stadisticsMapper = stadisticsMapper;
        this.playerFormMapper = playerFormMapper;
        this.locationMapper = locationMapper;
        this.playgroundMapper = playgroundMapper;
        this.db = db;
    }
    fromJsonOverview(obj) {
        throw new Error('Method not implemented.');
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
            score: obj['score'] ? this.scoreMapper.fromJson(obj['score']) : undefined,
            teamA: this.teamMapper.fromJson(obj['team-a']),
            teamB: this.teamMapper.fromJson(obj['team-b']),
            date: obj['date'],
            completed: obj['completed'],
            observations: obj['observations'],
            captainASignature: obj['captain-a-signature'],
            captainBSignature: obj['captain-b-signature'],
            judgeSignature: obj['judge-signature'],
            playerForm: obj['player-form']
                ? this.playerFormMapper.fromJson(obj['player-form'])
                : undefined,
            stadistics: !!obj.stadistics
                ? this.stadisticsMapper.fromJson(obj.stadistics)
                : undefined,
            location: obj['location']
                ? this.locationMapper.fromJson(obj['location'])
                : undefined,
            playground: obj['playground']
                ? this.playgroundMapper.fromJson(obj['playground'])
                : undefined,
        };
    }
    toJson(match) {
        return {
            'team-a': this.teamMapper.toReferenceJson(match.teamA),
            'team-b': this.teamMapper.toReferenceJson(match.teamB),
            date: match.date,
            playground: match.playground,
            location: match.location
                ? this.db.collection(locations_constants_1.LOCATIONS_ENTITY).doc(match.location.id)
                : undefined,
            observations: match.observations,
            'captain-a-signature': match.captainASignature,
            'captain-b-signature': match.captainBSignature,
            'judge-signature': match.judgeSignature,
            stadistics: match.stadistics
                ? this.stadisticsMapper.toJson(match.stadistics)
                : {},
            completed: !!match.completed,
            'player-form': match.playerForm
                ? this.playerFormMapper.toJson(match.playerForm)
                : {},
            score: match.score ? this.scoreMapper.toJson(match.score) : null,
        };
    }
}
exports.MatchMapper = MatchMapper;
