"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntergroupMatchMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class IntergroupMatchMapper extends mapper_1.Mapper {
    constructor(matchMapper) {
        super();
        this.matchMapper = matchMapper;
        this.attributesMapper = {
            fixtureStageId: { name: 'fixture-stage-id' },
            match: {
                name: 'match',
                from: (val) => {
                    return this.matchMapper.fromJson(val);
                },
                to: (match) => {
                    return this.matchMapper.toJson(match);
                },
            },
            id: { name: 'id' },
        };
    }
}
exports.IntergroupMatchMapper = IntergroupMatchMapper;
