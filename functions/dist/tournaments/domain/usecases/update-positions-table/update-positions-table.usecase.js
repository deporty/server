"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePositionTableUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const crespo_1 = require("./crespo");
const tie_breaking_handlers_1 = require("./tie-breaking-handlers");
const update_positions_table_helpers_1 = require("./update-positions-table.helpers");
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
                    response[key] = response[key] + stadistic.totalYellowCards * yellowCardScale + stadistic.totalRedCards * redCardScale;
                }
            }
        };
        fn(match, response, 'teamA');
        fn(match, response, 'teamB');
        return response;
    }
    orderByPoints(table) {
        const groupedTable = {};
        for (const item of table) {
            const points = item.stadistics.points.toString();
            if (!groupedTable[points]) {
                groupedTable[points] = [];
            }
            groupedTable[points].push(item);
        }
        const keys = Object.keys(groupedTable)
            .map((x) => parseInt(x))
            .sort((a, b) => b - a);
        const res = [];
        for (const k of keys) {
            res.push(groupedTable[k.toString()]);
        }
        return res;
    }
    resolveTies(groupedTable, tieBreakingOrder, param) {
        const response = [];
        const temp = [];
        for (const group of groupedTable) {
            const $orderedTable = (0, crespo_1.quicksort)(group, tieBreakingOrder, group.length, param, this.getAnyMatchByTeamIdsUsecase);
            temp.push($orderedTable);
        }
        if (temp.length == 0) {
            return (0, rxjs_1.of)(response);
        }
        return (0, rxjs_1.zip)(...temp).pipe((0, operators_1.map)((data) => {
            return data.reduce((acc, prev) => {
                acc.push(...prev);
                return acc;
            }, []);
        }));
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
