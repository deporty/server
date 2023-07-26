"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoreMapper = void 0;
class ScoreMapper {
    fromJson(obj) {
        return {
            teamA: obj['team-a'],
            teamB: obj['team-b'],
        };
    }
    toJson(score) {
        return {
            'team-a': score.teamA,
            'team-b': score.teamB,
        };
    }
}
exports.ScoreMapper = ScoreMapper;
