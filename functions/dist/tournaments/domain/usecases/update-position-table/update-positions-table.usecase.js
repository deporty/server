"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionTableUsecase = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../../core/usecase");
const organizations_1 = require("@deporty-org/entities/organizations");
class UpdatePositionTableUsecase extends usecase_1.Usecase {
    constructor() {
        // private getAnyMatchByTeamIdsUsecase: GetAnyMatchByTeamIdsUsecase
        super();
    }
    call(param) {
        const teamIds = param.availableTeams || [];
        const tieBreakingOrder = param.tieBreakingOrder;
        const positionsTable = param.positionsTable || {
            analizedMatches: [],
            table: [],
        };
        const table = positionsTable.table;
        const analizedMatches = positionsTable.analizedMatches;
        const match = param.match;
        if (!analizedMatches.includes(match.id)) {
            analizedMatches.push(match.id);
            const teamAId = match.teamAId;
            const teamBId = match.teamBId;
            const teamAIdFlag = teamIds.includes(teamAId);
            const teamBIdFlag = teamIds.includes(teamBId);
            const failPlayStadistics = this.getFairPlayerStadisticFromMatchByTeam(match, param.negativePointsPerCard);
            const existsA = table.find((x) => x.teamId === teamAId);
            const existsB = table.find((x) => x.teamId === teamBId);
            if (!existsA && teamAIdFlag) {
                table.push({
                    teamId: teamAId,
                    stadistics: this.generateEmptyStadistics(),
                    wasByRandom: false,
                });
            }
            if (!existsB && teamBIdFlag) {
                table.push({
                    teamId: teamBId,
                    stadistics: this.generateEmptyStadistics(),
                    wasByRandom: false,
                });
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
                    this.setStadistic(teamIds, winnerTeam.winner, table, 'points', param.pointsConfiguration.wonMatchPoints);
                    this.setStadistic(teamIds, winnerTeam.winner, table, 'wonMatches', 1);
                    this.setStadistic(teamIds, winnerTeam.winner, table, 'points', param.pointsConfiguration.lostMatchPoints);
                    this.setStadistic(teamIds, winnerTeam.loser, table, 'lostMatches', 1);
                }
                else if (winnerTeam === null) {
                    this.setStadistic(teamIds, teamAId, table, 'tiedMatches', 1);
                    this.setStadistic(teamIds, teamAId, table, 'points', param.pointsConfiguration.tieMatchPoints);
                    this.setStadistic(teamIds, teamBId, table, 'tiedMatches', 1);
                    this.setStadistic(teamIds, teamBId, table, 'points', param.pointsConfiguration.tieMatchPoints);
                }
            }
            console.log();
            console.log('Original table: ', table);
            console.log();
            const calculatedTable = table.map((row) => {
                const value = row;
                const goalsAgainstPerMatch = Math.trunc((value.stadistics.goalsAgainst / value.stadistics.playedMatches) *
                    100) / 100;
                return {
                    teamId: row.teamId,
                    stadistics: Object.assign(Object.assign({}, value.stadistics), { goalsAgainstPerMatch }),
                    wasByRandom: value.wasByRandom,
                };
            });
            const groupedTable = this.orderByPoints(calculatedTable);
            const response = [];
            for (const group of groupedTable) {
                console.log('...');
                console.log(JSON.stringify(group, null, 2));
                console.log('...');
            }
            for (const group of groupedTable) {
                const orderedTable = group.sort((prev, next) => {
                    return this.order(prev, next, tieBreakingOrder, 0);
                });
                response.push(...orderedTable);
            }
            return (0, rxjs_1.of)({
                analizedMatches,
                table: response,
            });
        }
        return (0, rxjs_1.of)(positionsTable);
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
    getFairPlayerStadisticFromMatchByTeam(match, negativePointsPerCard) {
        const yellowCardScale = negativePointsPerCard.yellowCardsNegativePoints;
        const redCardScale = negativePointsPerCard.redCardsNegativePoints;
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
    orderByPoints(table) {
        const groupedTable = [];
        let prevPoints = null;
        let group = [];
        for (const item of table) {
            console.log();
            console.log('Item ', item);
            console.log(groupedTable);
            console.log();
            if (prevPoints === null) {
                prevPoints = item.stadistics.points;
            }
            if (item.stadistics.points === prevPoints) {
                group.push(item);
            }
            else {
                groupedTable.push([...group]);
                group = [item];
            }
        }
        groupedTable.push([...group]);
        return groupedTable.sort((a, b) => {
            const a0 = a[0];
            const b0 = b[0];
            return a0 < b0 ? -1 : 1;
        });
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
        const config = organizations_1.TieBreakingOrderMap[currentOrder];
        const property = config.property;
        if (property !== null) {
            const operator = config.operator;
            const result = operator(a.stadistics[property], b.stadistics[property]);
            if (result === 0) {
                return this.order(a, b, order, index + 1);
            }
            else {
                return result;
            }
        }
        else {
            return 0;
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
            const item = table.find((x) => x.teamId == teamId);
            if (item) {
                item.stadistics[stadistic] =
                    item.stadistics[stadistic] + increment;
            }
        }
    }
}
exports.UpdatePositionTableUsecase = UpdatePositionTableUsecase;
