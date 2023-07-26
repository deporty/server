"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPositionsTableUsecase = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../core/usecase");
class GetPositionsTableUsecase extends usecase_1.Usecase {
    constructor() {
        super();
    }
    call(param) {
        const defaultStadistics = {
            goalsAgainst: 0,
            goalsAgainstPerMatch: 0,
            goalsDifference: 0,
            goalsInFavor: 0,
            fairPlay: 0,
            lostMatches: 0,
            playedMatches: 0,
            points: 0,
            tiedMatches: 0,
            wonMatches: 0,
        };
        const table = {};
        const teams = {};
        for (const match of param.matches) {
            if (match.completed) {
                const failPlayStadistics = this.getFairPlayerStadisticFromMatchByTeam(match);
                const teamAId = match.teamA.id;
                const teamBId = match.teamB.id;
                const isOfGroupA = param.availableTeams.findIndex((x) => x.id === teamAId) > -1;
                const isOfGroupB = param.availableTeams.findIndex((x) => x.id === teamBId) > -1;
                if (!(teamAId in table) && isOfGroupA) {
                    table[teamAId] = Object.assign({}, defaultStadistics);
                    teams[teamAId] =
                        param.availableTeams[param.availableTeams.findIndex((x) => x.id === teamAId)];
                    table[teamAId].fairPlay =
                        table[teamAId].fairPlay + failPlayStadistics.teamA;
                }
                if (!(teamBId in table) && isOfGroupB) {
                    table[teamBId] = Object.assign({}, defaultStadistics);
                    teams[teamBId] =
                        param.availableTeams[param.availableTeams.findIndex((x) => x.id === teamBId)];
                    table[teamBId].fairPlay =
                        table[teamBId].fairPlay + failPlayStadistics.teamB;
                }
                const winnerTeam = this.getWinnerTeam(match);
                if (winnerTeam !== undefined) {
                    if (isOfGroupA) {
                        table[teamAId].playedMatches = table[teamAId].playedMatches + 1;
                    }
                    if (isOfGroupB) {
                        table[teamBId].playedMatches = table[teamBId].playedMatches + 1;
                    }
                    if (match.score) {
                        if (isOfGroupA) {
                            table[teamAId].goalsAgainst =
                                table[teamAId].goalsAgainst + match.score.teamB;
                            table[teamAId].goalsInFavor =
                                table[teamAId].goalsInFavor + match.score.teamA;
                            table[teamAId].goalsDifference =
                                table[teamAId].goalsDifference +
                                    match.score.teamA -
                                    match.score.teamB;
                        }
                        if (isOfGroupB) {
                            table[teamBId].goalsAgainst =
                                table[teamBId].goalsAgainst + match.score.teamA;
                            table[teamBId].goalsInFavor =
                                table[teamBId].goalsInFavor + match.score.teamB;
                            table[teamBId].goalsDifference =
                                table[teamBId].goalsDifference +
                                    match.score.teamB -
                                    match.score.teamA;
                        }
                    }
                    if (winnerTeam) {
                        const isOfGroupWinner = param.availableTeams.findIndex((x) => x.id === winnerTeam.winner) > -1;
                        const isOfGroupLoser = param.availableTeams.findIndex((x) => x.id === winnerTeam.loser) >
                            -1;
                        if (isOfGroupWinner) {
                            table[winnerTeam.winner].points =
                                table[winnerTeam.winner].points + 3;
                            table[winnerTeam.winner].wonMatches =
                                table[winnerTeam.winner].wonMatches + 1;
                        }
                        if (isOfGroupLoser) {
                            table[winnerTeam.loser].lostMatches =
                                table[winnerTeam.loser].lostMatches + 1;
                        }
                    }
                    else if (winnerTeam === null) {
                        if (isOfGroupA) {
                            table[teamAId].tiedMatches = table[teamAId].tiedMatches + 1;
                            table[teamAId].points = table[teamAId].points + 1;
                        }
                        if (isOfGroupB) {
                            table[teamBId].tiedMatches = table[teamBId].tiedMatches + 1;
                            table[teamBId].points = table[teamBId].points + 1;
                        }
                    }
                }
            }
        }
        const previusTable = Object.keys(table)
            .map((entry) => {
            const value = table[entry];
            return Object.assign(Object.assign({ team: teams[entry] }, value), { goalsAgainstPerMatch: Math.trunc((value.goalsAgainst / value.playedMatches) * 100) / 100 });
        })
            .sort((prev, next) => {
            if (prev.points < next.points) {
                return 1;
            }
            //  if (prev.points > next.points)
            else {
                return -1;
            }
            // else {
            //   if (prev.goalsDifference < next.goalsDifference) {
            //     return 1;
            //   } else if (prev.goalsDifference > next.goalsDifference) {
            //     return -1;
            //   } else {
            //     if (prev.goalsInFavor < next.goalsInFavor) {
            //       return 1;
            //     } else if (prev.goalsInFavor > next.goalsInFavor) {
            //       return -1;
            //     } else {
            //       return 1;
            //     }
            //   }
            // }
        });
        const groupedStadistics = this.groupSimilarMatches(previusTable);
        for (const groupedStadistic of groupedStadistics) {
            if (groupedStadistic.length == 2) {
                const wasOrdered = this.orderTwoStadistics(groupedStadistic, param.matches);
                if (!wasOrdered) {
                    this.orderManyStadistics(groupedStadistic);
                }
            }
            else {
                this.orderManyStadistics(groupedStadistic);
            }
        }
        const reorderedStadistics = groupedStadistics.reduce((prev, curr) => {
            prev.push(...curr);
            return prev;
        }, []);
        return (0, rxjs_1.of)(reorderedStadistics);
    }
    groupSimilarMatches(stadistics) {
        const response = [];
        if (stadistics.length > 0) {
            let prevPoints = stadistics[0].points;
            let groupedTemp = [stadistics[0]];
            for (let i = 1; i < stadistics.length; i++) {
                const stadistic = stadistics[i];
                if (prevPoints === stadistic.points) {
                    groupedTemp.push(stadistic);
                }
                else {
                    prevPoints = stadistic.points;
                    response.push([...groupedTemp]);
                    groupedTemp = [stadistic];
                }
            }
            response.push([...groupedTemp]);
        }
        return response;
    }
    getFairPlayerStadisticFromMatchByTeam(match) {
        const yellowCardScale = 1;
        const redCardScale = 2;
        const response = {
            teamA: 0,
            teamB: 0,
        };
        const fn = (match, response, key) => {
            if (match.stadistics && match.stadistics[key]) {
                for (const stadistic of match.stadistics[key]) {
                    response[key] =
                        response[key] +
                            stadistic.totalYellowCards * yellowCardScale +
                            stadistic.totalRedCards * redCardScale;
                }
            }
        };
        fn(match, response, 'teamA');
        fn(match, response, 'teamB');
        return response;
    }
    getWinnerTeam(match) {
        let response = undefined;
        if (match.score &&
            match.score.teamA != null &&
            match.score.teamB != null &&
            typeof match.score.teamA == 'number' &&
            typeof match.score.teamB == 'number') {
            if (match.score.teamA < match.score.teamB) {
                response = {
                    winner: match.teamB.id,
                    loser: match.teamA.id,
                };
            }
            else if (match.score.teamA > match.score.teamB) {
                response = {
                    winner: match.teamA.id,
                    loser: match.teamB.id,
                };
            }
            else {
                response = null;
            }
        }
        return response;
    }
    orderManyStadistics(stadistics) {
        stadistics.sort((prev, next) => {
            if (prev.wonMatches < next.wonMatches) {
                return 1;
            }
            else if (prev.wonMatches > next.wonMatches) {
                return -1;
            }
            else {
                if (prev.goalsDifference < next.goalsDifference) {
                    return 1;
                }
                else if (prev.goalsDifference > next.goalsDifference) {
                    return -1;
                }
                else {
                    if (prev.goalsInFavor < next.goalsInFavor) {
                        return 1;
                    }
                    else if (prev.goalsInFavor > next.goalsInFavor) {
                        return -1;
                    }
                    else {
                        if (prev.fairPlay > next.fairPlay) {
                            return 1;
                        }
                        else if (prev.fairPlay < next.fairPlay) {
                            return -1;
                        }
                        else {
                            return 1;
                        }
                    }
                }
            }
        });
    }
    orderTwoStadistics(stadistics, matches) {
        const match = matches.filter((m) => {
            return ((m.teamA.id == stadistics[0].team.id &&
                m.teamB.id == stadistics[1].team.id) ||
                (m.teamA.id == stadistics[1].team.id &&
                    m.teamB.id == stadistics[0].team.id));
        });
        if (match.length == 1) {
            const result = this.getWinnerTeam(match[0]);
            if (result) {
                stadistics.sort((prev, next) => {
                    return prev.team.id == match[0][result.winner] ? 1 : -1;
                });
                return true;
            }
            return false;
        }
        return false;
    }
}
exports.GetPositionsTableUsecase = GetPositionsTableUsecase;
