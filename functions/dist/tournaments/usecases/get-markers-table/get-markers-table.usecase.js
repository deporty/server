"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMarkersTableUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetMarkersTableUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournamentId) {
        return this.tournamentContract.getByIdPopulate(tournamentId).pipe((0, operators_1.map)((tournament) => {
            const scorers = [];
            if (tournament && tournament.fixture) {
                for (const stage of tournament.fixture.stages) {
                    for (const group of stage.groups) {
                        if (group.matches) {
                            for (const match of group.matches) {
                                if (match.stadistics) {
                                    newFunction(match.stadistics.teamA, match.teamA, scorers);
                                    newFunction(match.stadistics.teamB, match.teamB, scorers);
                                }
                            }
                        }
                    }
                }
            }
            const response = scorers;
            return response.sort((prev, next) => {
                return prev.goals > next.goals ? -1 : 1;
            });
        }));
        function findStadisticInScores(scorers, playerStadistic) {
            const response = scorers.filter((x) => {
                return x.player === playerStadistic.player;
            });
            return response.length === 1 ? response.pop() : null;
        }
        function newFunction(stadisticsByTeam, team, scorers) {
            if (!!stadisticsByTeam) {
                for (const playerStadistic of stadisticsByTeam) {
                    if (playerStadistic.totalGoals) {
                        let stadistic = findStadisticInScores(scorers, playerStadistic);
                        if (!stadistic) {
                            stadistic = {
                                player: playerStadistic.player,
                                goals: 0,
                                team: team.name,
                                teamShield: team.shield,
                            };
                            scorers.push(stadistic);
                        }
                        stadistic['goals'] =
                            stadistic['goals'] + playerStadistic.totalGoals;
                    }
                }
            }
        }
    }
}
exports.GetMarkersTableUsecase = GetMarkersTableUsecase;
