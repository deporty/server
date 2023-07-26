"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureStageMapper = void 0;
class FixtureStageMapper {
    constructor(groupMapper) {
        this.groupMapper = groupMapper;
    }
    fromJson(obj) {
        return {
            groups: obj['groups']
                ? obj['groups']
                    .map((x, index) => {
                    return Object.assign(Object.assign({}, x), { index });
                })
                    .map((x) => this.groupMapper.fromJson(x))
                    .sort((a, b) => {
                    return a.label > b.label ? 1 : -1;
                })
                : [],
            order: obj['order'],
            id: obj['id'],
        };
    }
    toJson(fixtureStage) {
        return {
            order: fixtureStage.order,
            groups: !!fixtureStage.groups ? fixtureStage.groups.map((x) => {
                return this.groupMapper.toJson(x);
            }) : [],
            id: fixtureStage.id
        };
    }
}
exports.FixtureStageMapper = FixtureStageMapper;
