"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StadisticSpecificationMapper = exports.StadisticsMapper = void 0;
const mapper_1 = require("../../../core/mapper");
const rxjs_1 = require("rxjs");
class StadisticsMapper extends mapper_1.Mapper {
    constructor(stadisticSpecificationMapper) {
        super();
        this.stadisticSpecificationMapper = stadisticSpecificationMapper;
        this.attributesMapper = {
            teamA: {
                name: 'team-a',
                to: (values) => {
                    return values
                        ? values.map((val) => {
                            return this.stadisticSpecificationMapper.toJson(val);
                        })
                        : undefined;
                },
                from: (value) => {
                    return value && value.length > 0
                        ? (0, rxjs_1.zip)(...value.map((val) => {
                            return this.stadisticSpecificationMapper.fromJson(val);
                        }))
                        : (0, rxjs_1.of)([]);
                },
            },
            teamB: {
                name: 'team-b',
                to: (values) => {
                    return values
                        ? values.map((val) => {
                            return this.stadisticSpecificationMapper.toJson(val);
                        })
                        : undefined;
                },
                from: (value) => {
                    return value && value.length > 0
                        ? (0, rxjs_1.zip)(...value.map((val) => {
                            return this.stadisticSpecificationMapper.fromJson(val);
                        }))
                        : (0, rxjs_1.of)([]);
                },
            },
            extraGoalsTeamA: { name: 'extra-goals-team-a' },
            extraGoalsTeamB: { name: 'extra-goals-team-b' },
        };
    }
}
exports.StadisticsMapper = StadisticsMapper;
class StadisticSpecificationMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            memberId: { name: 'member-id' },
            goals: {
                name: 'goals',
            },
            totalGoals: { name: 'total-goals' },
            redCards: { name: 'red-cards' },
            totalRedCards: { name: 'total-red-cards' },
            yellowCards: { name: 'yellow-cards' },
            totalYellowCards: { name: 'total-yellow-cards' },
        };
    }
}
exports.StadisticSpecificationMapper = StadisticSpecificationMapper;
