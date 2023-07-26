"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntergroupMatchMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class IntergroupMatchMapper extends mapper_1.Mapper {
    constructor(matchMapper) {
        super();
        this.matchMapper = matchMapper;
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
            match: obj['match'] ? this.matchMapper.fromJson(obj['match']) : undefined,
            teamAGroup: obj['team-a-group'],
            teamBGroup: obj['team-b-group'],
            id: obj['id'],
        };
    }
    toJson(match) {
        return {
            'team-a-group': match.teamAGroup,
            'team-b-group': match.teamBGroup,
            match: match.match ? this.matchMapper.toJson(match.match) : undefined,
        };
    }
}
exports.IntergroupMatchMapper = IntergroupMatchMapper;
