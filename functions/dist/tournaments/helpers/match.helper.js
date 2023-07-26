"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findMatchInList = exports.existSMatchInList = void 0;
function existSMatchInList(match, matches) {
    return (matches.filter((m) => {
        return ((m.teamAId === match.teamAId && m.teamBId === match.teamBId) ||
            (m.teamAId === match.teamBId && m.teamBId === match.teamAId));
    }).length > 0);
}
exports.existSMatchInList = existSMatchInList;
function findMatchInList(match, matches) {
    return matches.findIndex((m) => {
        return ((m.teamAId === match.teamAId && m.teamBId === match.teamBId) ||
            (m.teamAId === match.teamBId && m.teamBId === match.teamAId));
    });
}
exports.findMatchInList = findMatchInList;
