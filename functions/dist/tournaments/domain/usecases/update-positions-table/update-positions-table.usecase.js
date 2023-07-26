"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionTableUsecase = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../../core/usecase");
const tie_breaking_handlers_1 = require("./tie-breaking-handlers");
const update_positions_table_helpers_1 = require("./update-positions-table.helpers");
const operators_1 = require("rxjs/operators");
class UpdatePositionTableUsecase extends usecase_1.Usecase {
    constructor(getAnyMatchByTeamIdsUsecase) {
        super();
        this.getAnyMatchByTeamIdsUsecase = getAnyMatchByTeamIdsUsecase;
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
                    stadistics: (0, update_positions_table_helpers_1.generateEmptyStadistics)(),
                    wasByRandom: false,
                });
            }
            if (!existsB && teamBIdFlag) {
                table.push({
                    teamId: teamBId,
                    stadistics: (0, update_positions_table_helpers_1.generateEmptyStadistics)(),
                    wasByRandom: false,
                });
            }
            (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamAId, table, 'fairPlay', failPlayStadistics.teamA);
            (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamAId, table, 'playedMatches', 1);
            (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamBId, table, 'fairPlay', failPlayStadistics.teamB);
            (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamBId, table, 'playedMatches', 1);
            if (match.score) {
                this.setGoalStadistics(teamIds, table, teamAId, match, teamBId);
            }
            const winnerTeam = (0, tie_breaking_handlers_1.getWinnerTeam)(match);
            if (winnerTeam !== undefined) {
                if (winnerTeam) {
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, winnerTeam.winner, table, 'points', param.pointsConfiguration.wonMatchPoints);
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, winnerTeam.winner, table, 'wonMatches', 1);
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, winnerTeam.winner, table, 'points', param.pointsConfiguration.lostMatchPoints);
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, winnerTeam.loser, table, 'lostMatches', 1);
                }
                else if (winnerTeam === null) {
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamAId, table, 'tiedMatches', 1);
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamAId, table, 'points', param.pointsConfiguration.tieMatchPoints);
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamBId, table, 'tiedMatches', 1);
                    (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamBId, table, 'points', param.pointsConfiguration.tieMatchPoints);
                }
            }
            console.log();
            console.log('Original table: ', table);
            console.log();
            const calculatedTable = (0, update_positions_table_helpers_1.calculateGoalsAgainsPerMatch)(table);
            const groupedTable = this.orderByPoints(calculatedTable);
            const response = this.resolveTies(groupedTable, tieBreakingOrder, param).pipe((0, operators_1.map)((table) => {
                return {
                    analizedMatches,
                    table: table,
                };
            }));
            return response;
        }
        return (0, rxjs_1.of)(positionsTable);
    }
    resolveTies(groupedTable, tieBreakingOrder, param) {
        const response = [];
        for (const group of groupedTable) {
            console.log('...');
            console.log(JSON.stringify(group, null, 2));
            console.log('...');
        }
        for (const group of groupedTable) {
            // const len = group.length;
            const orderedTable = group.sort((prev, next) => {
                return this.order(prev, next, tieBreakingOrder, 0, param);
            });
            response.push(...orderedTable);
        }
        return (0, rxjs_1.of)(response);
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
    orderByPoints(table) {
        const groupedTable = [];
        let prevPoints = null;
        let group = [];
        for (const item of table) {
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
            return -1 * (a0.stadistics.points - b0.stadistics.points);
        });
    }
    order(a, b, order, index, param) {
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
        if (tie_breaking_handlers_1.BASIC_TIE_BREAKING_ORDER_MAP[currentOrder]) {
            const config = tie_breaking_handlers_1.BASIC_TIE_BREAKING_ORDER_MAP[currentOrder];
            const property = config.property;
            const operator = config.operator;
            const result = operator(a.stadistics[property], b.stadistics[property]);
            if (result === 0) {
                return this.order(a, b, order, index + 1, param);
            }
            else {
                return result;
            }
        }
        else {
            const config = tie_breaking_handlers_1.ADVANCED_TIE_BREAKING_ORDER_MAP[currentOrder];
            const operator = config.operator;
            if (currentOrder == 'WB2') {
                operator(this.getAnyMatchByTeamIdsUsecase, a.teamId, b.teamId, param.meta);
            }
            return 0;
        }
    }
    setGoalStadistics(teamIds, table, teamAId, match, teamBId) {
        (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamAId, table, 'goalsAgainst', match.score.teamB);
        (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamAId, table, 'goalsInFavor', match.score.teamA);
        (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamAId, table, 'goalsDifference', match.score.teamA - match.score.teamB);
        (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamBId, table, 'goalsAgainst', match.score.teamA);
        (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamBId, table, 'goalsInFavor', match.score.teamB);
        (0, update_positions_table_helpers_1.setStadistic)(teamIds, teamBId, table, 'goalsDifference', match.score.teamB - match.score.teamA);
    }
}
exports.UpdatePositionTableUsecase = UpdatePositionTableUsecase;
