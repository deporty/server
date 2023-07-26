"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMapper = void 0;
class GroupMapper {
    constructor(matchMapper, teamMapper) {
        this.matchMapper = matchMapper;
        this.teamMapper = teamMapper;
    }
    fromJson(obj) {
        return {
            matches: obj['matches']
                ? obj['matches'].map((x) => this.matchMapper.fromJson(x))
                : undefined,
            teams: obj['teams']
                ? obj['teams'].map((x) => this.teamMapper.fromJson(x))
                : [],
            label: obj['label'],
            order: obj['order'],
        };
    }
    toJson(group) {
        return {
            label: group.label,
            order: group.order,
            matches: !!group.matches
                ? group.matches.map((x) => this.matchMapper.toJson(x))
                : [],
            teams: !!group.teams
                ? group.teams.map((x) => this.teamMapper.toReferenceJson(x))
                : [],
        };
    }
}
exports.GroupMapper = GroupMapper;
