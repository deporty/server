"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchMapper = void 0;
class MatchMapper {
    constructor(scoreMapper, teamMapper, stadisticsMapper, playerFormMapper) {
        this.scoreMapper = scoreMapper;
        this.teamMapper = teamMapper;
        this.stadisticsMapper = stadisticsMapper;
        this.playerFormMapper = playerFormMapper;
    }
    fromJson(obj) {
        return {
            score: obj['score'] ? this.scoreMapper.fromJson(obj['score']) : undefined,
            teamA: this.teamMapper.fromJson(obj['team-a']),
            teamB: this.teamMapper.fromJson(obj['team-b']),
            date: obj['date'],
            playground: obj['playground'],
            playerForm: obj['player-form']
                ? this.playerFormMapper.fromJson(obj['player-form'])
                : undefined,
            stadistics: !!obj.stadistics
                ? this.stadisticsMapper.fromJson(obj.stadistics)
                : undefined,
        };
    }
    toJson(match) {
        return {
            'team-a': this.teamMapper.toReferenceJson(match.teamA),
            'team-b': this.teamMapper.toReferenceJson(match.teamB),
            date: match.date,
            playground: match.playground,
            stadistics: match.stadistics
                ? this.stadisticsMapper.toJson(match.stadistics)
                : {},
            'player-form': match.playerForm
                ? this.playerFormMapper.toJson(match.playerForm)
                : {},
            score: match.score ? this.scoreMapper.toJson(match.score) : null,
        };
    }
}
exports.MatchMapper = MatchMapper;
