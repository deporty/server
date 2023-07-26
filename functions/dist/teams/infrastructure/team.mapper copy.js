"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMapper = void 0;
const mapper_1 = require("../../core/mapper");
// import { PlayerMapper } from '../../players/infrastructure/player.mapper';
class TeamMapper extends mapper_1.Mapper {
    constructor() {
        super();
    }
    fromJsonWithOutId(obj) {
        return {
            name: obj['name'],
            athem: obj['athem'] || '',
            members: obj['members'] || [],
            shield: obj['shield'] || '',
            agent: obj['agent'] || '',
        };
    }
    fromJson(obj) {
        return {
            name: obj['name'],
            id: obj['id'],
            athem: obj['athem'],
            // members: obj['members']
            //   ? (obj['members'] as []).map((item) => {
            //       const obj = this.playerMapper.fromJson(item);
            //       return obj;
            //     })
            //   : [],
            members: obj['members'],
            shield: obj['shield'],
            agent: obj['agent'],
        };
    }
    toJson(team) {
        return {
            name: team.name,
            athem: team.athem || '',
            members: team.members
                ? team.members.map((member) => {
                    return member;
                })
                : [],
            shield: team.shield || '',
            agent: team.agent || '',
        };
    }
    toWeakJson(team) {
        return {
            name: team.name,
            id: team.id || '',
            shield: team.shield || '',
        };
    }
}
exports.TeamMapper = TeamMapper;
//# sourceMappingURL=team.mapper%20copy.js.map