"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWinnerTeam = exports.ADVANCED_TIE_BREAKING_ORDER_MAP = exports.BASIC_TIE_BREAKING_ORDER_MAP = exports.preferMinor = exports.preferMajor = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
function preferMajor(a, b) {
    return a < b ? (0, rxjs_1.of)(1) : a > b ? (0, rxjs_1.of)(-1) : (0, rxjs_1.of)(0);
}
exports.preferMajor = preferMajor;
function preferMinor(a, b) {
    return a > b ? (0, rxjs_1.of)(1) : a < b ? (0, rxjs_1.of)(-1) : (0, rxjs_1.of)(0);
}
exports.preferMinor = preferMinor;
exports.BASIC_TIE_BREAKING_ORDER_MAP = {
    GA: {
        operator: preferMinor,
        property: "goalsAgainst",
    },
    GAPM: {
        operator: preferMinor,
        property: "goalsAgainstPerMatch",
    },
    GD: {
        operator: preferMajor,
        property: "goalsDifference",
    },
    GIF: {
        operator: preferMajor,
        property: "goalsInFavor",
    },
    FP: {
        operator: preferMinor,
        property: "fairPlay",
    },
    LM: {
        operator: preferMinor,
        property: "lostMatches",
    },
    PM: {
        operator: preferMinor,
        property: "playedMatches",
    },
    TM: {
        operator: preferMajor,
        property: "tiedMatches",
    },
    WM: {
        operator: preferMajor,
        property: "wonMatches",
    },
};
exports.ADVANCED_TIE_BREAKING_ORDER_MAP = {
    BP: {
        operator: () => {
            return (0, rxjs_1.of)(0);
        },
        condition: (groupLength) => {
            return true;
        },
    },
    BPGT: {
        operator: () => {
            return (0, rxjs_1.of)(0);
        },
        condition: (groupLength) => {
            return true;
        },
    },
    IP: {
        operator: () => {
            return (0, rxjs_1.of)(0);
        },
        condition: (groupLength) => {
            return true;
        },
    },
    WB2: {
        condition: (groupLength) => {
            return groupLength == 2;
        },
        operator: (getAnyMatchByTeamIdsUsecase, teamAId, teamBId, meta) => {
            return getAnyMatchByTeamIdsUsecase
                .call({
                fixtureStageId: meta.fixtureStageId,
                groupId: meta.groupId,
                teamAId,
                teamBId,
                tournamentId: meta.tournamentId,
            })
                .pipe((0, operators_1.map)((match) => {
                if (!match)
                    return 0;
                const result = getWinnerTeam(match);
                if (!result)
                    return 0;
                return result.winner === match.teamAId ? 1 : -1;
            }));
        },
    },
};
function getWinnerTeam(match) {
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
exports.getWinnerTeam = getWinnerTeam;
