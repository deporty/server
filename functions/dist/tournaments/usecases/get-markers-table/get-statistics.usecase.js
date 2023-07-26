"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStatisticsUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetStatisticsUsecase extends usecase_1.Usecase {
    constructor(getPlayerByIdUsecase, tournamentContract) {
        super();
        this.getPlayerByIdUsecase = getPlayerByIdUsecase;
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getByIdPopulate(tournamentId).pipe((0, operators_1.map)((tournament) => {
            const scorers = {};
            if (tournament && tournament.fixture) {
                for (const stage of tournament.fixture.stages) {
                    for (const group of stage.groups) {
                        if (group.matches) {
                            for (const match of group.matches) {
                                if (match.stadistics) {
                                    for (const playerId in match.stadistics.teamA) {
                                        if (Object.prototype.hasOwnProperty.call(match.stadistics.teamA, playerId)) {
                                            const playerStadistic = match.stadistics.teamA[playerId];
                                            if (playerStadistic.goals) {
                                                if (!(playerId in scorers)) {
                                                    scorers[playerId] = {
                                                        goals: 0,
                                                        team: match.teamA.name,
                                                        teamBadge: match.teamA.shield,
                                                    };
                                                }
                                                scorers[playerId]['goals'] =
                                                    scorers[playerId]['goals'] +
                                                        playerStadistic.goals.length;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const response = [];
            for (const playerId in scorers) {
                if (Object.prototype.hasOwnProperty.call(scorers, playerId)) {
                    const config = scorers[playerId];
                    response.push({
                        team: config.team,
                        goals: config.goals,
                        badge: config.teamBadge,
                        player: playerId,
                    });
                }
            }
            console.log(response, 'RESPONSE');
            return (0, rxjs_1.of)(response).pipe((0, operators_1.map)((item) => {
                return item.map((x) => {
                    return this.getPlayerByIdUsecase.call(x.player).pipe((0, operators_1.map)((p) => {
                        return {
                            player: `${p.name} ${p.lastName}`,
                            team: x.team,
                            goals: x.goals,
                            badge: x.badge,
                        };
                    }));
                });
            }), (0, operators_1.map)((items) => {
                return (0, rxjs_1.zip)(...items);
            }), (0, operators_1.mergeMap)((x) => x));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.GetStatisticsUsecase = GetStatisticsUsecase;
//# sourceMappingURL=get-statistics.usecase.js.map