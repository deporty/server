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
            index: obj['index'],
        };
    }
    toJson(group) {
        return {
            label: group.label,
            matches: group.matches || [],
            teams: group.teams.map((x) => this.teamMapper.toWeakJson(x)) || [],
        };
    }
}
exports.GroupMapper = GroupMapper;
//# sourceMappingURL=group.mapper%20copy.js.map