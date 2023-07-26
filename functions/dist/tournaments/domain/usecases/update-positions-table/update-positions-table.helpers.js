"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateGoalsAgainsPerMatch = exports.setStadistic = exports.generateEmptyStadistics = void 0;
function generateEmptyStadistics() {
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
exports.generateEmptyStadistics = generateEmptyStadistics;
function setStadistic(teamIds, teamId, table, stadistic, increment) {
    if (teamIds.includes(teamId) && increment) {
        const item = table.find((x) => x.teamId == teamId);
        if (item) {
            item.stadistics[stadistic] =
                item.stadistics[stadistic] + increment;
        }
    }
}
exports.setStadistic = setStadistic;
function calculateGoalsAgainsPerMatch(table) {
    return table.map((row) => {
        const value = row;
        const goalsAgainstPerMatch = Math.trunc((value.stadistics.goalsAgainst / value.stadistics.playedMatches) *
            100) / 100;
        return {
            teamId: row.teamId,
            stadistics: Object.assign(Object.assign({}, value.stadistics), { goalsAgainstPerMatch }),
            wasByRandom: value.wasByRandom,
        };
    });
}
exports.calculateGoalsAgainsPerMatch = calculateGoalsAgainsPerMatch;
