"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerFormMapper = void 0;
class PlayerFormMapper {
    constructor(playerMapper) {
        this.playerMapper = playerMapper;
    }
    fromJson(obj) {
        const response = {
            teamA: !!obj['team-a'] ? obj['team-a'].map(x => this.playerMapper.fromJson(x)) : [],
            teamB: !!obj['team-b'] ? obj['team-b'].map(x => this.playerMapper.fromJson(x)) : [],
        };
        return response;
    }
    toJson(playerForm) {
        let response = {
            'team-a': (playerForm.teamA || []).map((x) => this.playerMapper.toReferenceJson(x)),
            'team-b': (playerForm.teamB || []).map((x) => this.playerMapper.toReferenceJson(x)),
        };
        return response;
    }
}
exports.PlayerFormMapper = PlayerFormMapper;
