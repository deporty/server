"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixtureMapper = void 0;
class FixtureMapper {
    constructor(fixtureStageMapper) {
        this.fixtureStageMapper = fixtureStageMapper;
    }
    fromJson(obj) {
        return {
            stages: obj['fixture-stages'].map((s) => {
                return this.fixtureStageMapper.fromJson(s);
            }),
            tournamentBracket: obj['tournament-bracket'],
        };
    }
    toJson(fixture) {
        return {
            'fixture-stages': fixture.stages.map((x) => {
                return this.fixtureStageMapper.toJson(x);
            }),
            'tournament-bracket': fixture.tournamentBracket
        };
    }
}
exports.FixtureMapper = FixtureMapper;
