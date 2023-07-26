"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPositionsTableUsecase = exports.TieBreakingOrderMap = exports.TieBreakingOrderEnum = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../core/usecase");
var TieBreakingOrderEnum;
(function (TieBreakingOrderEnum) {
    TieBreakingOrderEnum["GA"] = "GA";
    TieBreakingOrderEnum["GAPM"] = "GAPM";
    TieBreakingOrderEnum["GD"] = "GD";
    TieBreakingOrderEnum["GIF"] = "GIF";
    TieBreakingOrderEnum["FP"] = "FP";
    TieBreakingOrderEnum["LM"] = "LM";
    TieBreakingOrderEnum["PM"] = "PM";
    TieBreakingOrderEnum["P"] = "P";
    TieBreakingOrderEnum["TM"] = "TM";
    TieBreakingOrderEnum["WM"] = "WM";
})(TieBreakingOrderEnum = exports.TieBreakingOrderEnum || (exports.TieBreakingOrderEnum = {}));
exports.TieBreakingOrderMap = {
    GA: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'goalsAgainst',
    },
    GAPM: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'goalsAgainstPerMatch',
    },
    GD: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'goalsDifference',
    },
    GIF: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'goalsInFavor',
    },
    FP: {
        operator: (a, b) => (a < b ? -1 : a > b ? 1 : 0),
        property: 'fairPlay',
    },
    LM: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'lostMatches',
    },
    PM: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'playedMatches',
    },
    P: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'points',
    },
    TM: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'tiedMatches',
    },
    WM: {
        operator: (a, b) => (a < b ? 1 : a > b ? -1 : 0),
        property: 'wonMatches',
    },
};
class GetPositionsTableUsecase extends usecase_1.Usecase {
    constructor() {
        super();
    }
    call(param) {
        const teamIds = param.teamIds || [];
        const tieBreakingOrder = param.tieBreakingOrder || [
            'P',
            'GD',
            'FP',
        ];
        const table = {};
        const matchesToEvaluate = param.matches.filter((m) => m.status === 'completed');
        for (const match of matchesToEvaluate) {
            const teamAId = match.teamAId;
            const teamBId = match.teamBId;
            const teamAIdFlag = teamIds.includes(teamAId);
            const teamBIdFlag = teamIds.includes(teamBId);
            const failPlayStadistics = this.getFairPlayerStadisticFromMatchByTeam(match);
            if (!(teamAId in table) && teamAIdFlag) {
                table[teamAId] = this.generateEmptyStadistics();
            }
            if (!(teamBId in table) && teamBIdFlag) {
                table[teamBId] = this.generateEmptyStadistics();
            }
            this.setStadistic(teamIds, teamAId, table, 'fairPlay', failPlayStadistics.teamA);
            this.setStadistic(teamIds, teamAId, table, 'playedMatches', 1);
            this.setStadistic(teamIds, teamBId, table, 'fairPlay', failPlayStadistics.teamB);
            this.setStadistic(teamIds, teamBId, table, 'playedMatches', 1);
            if (match.score) {
                this.setGoalStadistics(teamIds, table, teamAId, match, teamBId);
            }
            const winnerTeam = this.getWinnerTeam(match);
            if (winnerTeam !== undefined) {
                if (winnerTeam) {
                    this.setStadistic(teamIds, winnerTeam.winner, table, 'points', 3);
                    this.setStadistic(teamIds, winnerTeam.winner, table, 'wonMatches', 1);
                    this.setStadistic(teamIds, winnerTeam.loser, table, 'lostMatches', 1);
                }
                else if (winnerTeam === null) {
                    this.setStadistic(teamIds, teamAId, table, 'tiedMatches', 1);
                    this.setStadistic(teamIds, teamAId, table, 'points', 1);
                    this.setStadistic(teamIds, teamBId, table, 'tiedMatches', 1);
                    this.setStadistic(teamIds, teamBId, table, 'points', 1);
                }
            }
        }
        const previusTable = Object.keys(table)
            .map((teamId) => {
            const value = table[teamId];
            return Object.assign(Object.assign({ teamId }, value), { goalsAgainstPerMatch: Math.trunc((value.goalsAgainst / value.playedMatches) * 100) / 100 });
        })
            .sort((prev, next) => {
            return this.order(prev, next, tieBreakingOrder, 0);
        });
        return (0, rxjs_1.of)(previusTable);
    }
    generateEmptyStadistics() {
        return {
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
        if (!match.score ||
            match.score.teamA == null ||
            match.score.teamA == undefined ||
            match.score.teamB == null ||
            match.score.teamB == undefined) {
            return undefined;
        }
        if (match.score.teamA < match.score.teamB) {
            response = {
                winner: match.teamBId,
                loser: match.teamAId,
            };
        }
        else if (match.score.teamA > match.score.teamB) {
            response = {
                winner: match.teamAId,
                loser: match.teamBId,
            };
        }
        else {
            response = null;
        }
        return response;
    }
    order(a, b, order, index) {
        if (index === order.length) {
            const randomNumber = Math.random();
            if (randomNumber > 0.5) {
                return -1;
            }
            else {
                return 1;
            }
        }
        const currentOrder = order[index];
        const config = exports.TieBreakingOrderMap[currentOrder];
        const property = config.property;
        const operator = config.operator;
        const result = operator(a[property], b[property]);
        if (result === 0) {
            return this.order(a, b, order, index + 1);
        }
        else {
            return result;
        }
    }
    setGoalStadistics(teamIds, table, teamAId, match, teamBId) {
        this.setStadistic(teamIds, teamAId, table, 'goalsAgainst', match.score.teamB);
        this.setStadistic(teamIds, teamAId, table, 'goalsInFavor', match.score.teamA);
        this.setStadistic(teamIds, teamAId, table, 'goalsDifference', match.score.teamA - match.score.teamB);
        this.setStadistic(teamIds, teamBId, table, 'goalsAgainst', match.score.teamA);
        this.setStadistic(teamIds, teamBId, table, 'goalsInFavor', match.score.teamB);
        this.setStadistic(teamIds, teamBId, table, 'goalsDifference', match.score.teamB - match.score.teamA);
    }
    setStadistic(teamIds, teamId, table, stadistic, increment) {
        if (teamIds.includes(teamId) && increment) {
            table[teamId][stadistic] =
                table[teamId][stadistic] + increment;
        }
    }
}
exports.GetPositionsTableUsecase = GetPositionsTableUsecase;
