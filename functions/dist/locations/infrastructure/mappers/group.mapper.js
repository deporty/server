"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class GroupMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            id: { name: 'id' },
            fixtureStageId: { name: 'fixture-stage-id' },
            label: { name: 'label' },
            order: { name: 'order' },
            teamIds: { name: 'teams' },
        };
    }
}
exports.GroupMapper = GroupMapper;
