"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StadisticsMapper = void 0;
class StadisticsMapper {
    constructor(playerMapper) {
        this.playerMapper = playerMapper;
    }
    fromJson(obj) {
        const response = {};
        const transform = (response, stadistic, teamLabel, teamObj) => {
            if (teamLabel in stadistic) {
                response[teamObj] = [];
                for (const playerStadistic of stadistic[teamLabel]) {
                    const tempObj = {
                        player: this.playerMapper.fromJson(playerStadistic.player),
                        goals: [],
                        totalGoals: playerStadistic['total-goals'],
                        redCards: playerStadistic['red-cards'],
                        yellowCards: playerStadistic['yellow-cards'],
                        totalYellowCards: playerStadistic['total-yellow-cards'],
                        totalRedCards: playerStadistic['total-red-cards'],
                    };
                    response[teamObj].push(tempObj);
                    if (!!playerStadistic['goals']) {
                        for (const goal of playerStadistic['goals']) {
                            tempObj['goals'].push({
                                kind: goal['kind'],
                                minute: goal['minute'],
                            });
                        }
                    }
                }
            }
        };
        transform(response, obj, 'team-a', 'teamA');
        transform(response, obj, 'team-b', 'teamB');
        return response;
    }
    toJson(stadistics) {
        let response = {};
        const transform = (data) => {
            let res = [];
            for (const specification of data) {
                const temp = {
                    goals: [],
                    'red-cards': specification.redCards,
                    'yellow-cards': specification.yellowCards,
                    'total-goals': specification.totalGoals,
                    'total-red-cards': specification.totalRedCards,
                    'total-yellow-cards': specification.totalYellowCards,
                    player: this.playerMapper.toReferenceJson(specification.player),
                };
                if (!specification['goals']) {
                    specification['goals'] = [];
                }
                for (const goal of specification['goals']) {
                    temp['goals'].push({
                        kind: goal.kind,
                        minute: goal.minute,
                    });
                }
                res.push(temp);
            }
            return res;
        };
        response['team-a'] = transform(stadistics.teamA || []);
        response['team-b'] = transform(stadistics.teamB || []);
        return response;
    }
}
exports.StadisticsMapper = StadisticsMapper;
