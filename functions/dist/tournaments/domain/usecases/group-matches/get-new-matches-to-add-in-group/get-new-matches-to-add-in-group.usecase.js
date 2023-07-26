"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetNewMatchesToAddInGroupUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class GetNewMatchesToAddInGroupUsecase extends usecase_1.Usecase {
    constructor(getGroupByIdUsecase, getGroupMatchesUsecase) {
        super();
        this.getGroupByIdUsecase = getGroupByIdUsecase;
        this.getGroupMatchesUsecase = getGroupMatchesUsecase;
    }
    call(param) {
        const $teamIds = this.getTeamIds(param);
        return $teamIds.pipe((0, operators_1.mergeMap)((teamIds) => {
            return this.makeMatrix(param, teamIds);
        }));
    }
    getTeamIds(param) {
        if (!param.teamIds) {
            return this.getGroupByIdUsecase
                .call({
                fixtureStageId: param.fixtureStageId,
                groupId: param.groupId,
                tournamentId: param.tournamentId,
            })
                .pipe((0, operators_1.map)((group) => {
                return group.teamIds;
            }));
        }
        return (0, rxjs_1.of)(param.teamIds);
    }
    areAllMatchesSetted(teamIds, matches) {
        const allPosibleMatches = ((teamIds.length - 1) * teamIds.length) / 2;
        return matches.length === allPosibleMatches;
    }
    makeMatrix(param, teamIds) {
        return this.getGroupMatchesUsecase
            .call({
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
            tournamentId: param.tournamentId,
            states: ['completed', 'editing', 'published'],
        })
            .pipe((0, operators_1.mergeMap)((matches) => {
            const areAllMatchesSetted = this.areAllMatchesSetted(teamIds, matches);
            if (!areAllMatchesSetted) {
                const matrix = {
                    teamIds,
                    table: Array.from({ length: teamIds.length }).map((x) => Array.from({ length: teamIds.length })),
                };
                for (const match of matches) {
                    const indexTeamA = teamIds.findIndex((t) => t == match.teamAId);
                    const indexTeamB = teamIds.findIndex((t) => t == match.teamBId);
                    matrix.table[indexTeamA][indexTeamB] = true;
                    matrix.table[indexTeamB][indexTeamA] = true;
                }
                const newMatches = [];
                for (let row = 1; row < teamIds.length; row++) {
                    for (let column = 0; column < row; column++) {
                        if (row != column) {
                            const existsMatch = matrix.table[row][column];
                            if (!existsMatch) {
                                const teamAId = matrix.teamIds[row];
                                const teamBId = matrix.teamIds[column];
                                const newMatch = {
                                    status: 'editing',
                                    teamAId,
                                    teamBId,
                                };
                                newMatches.push(newMatch);
                                matrix.table[row][column] = true;
                                matrix.table[column][row] = true;
                            }
                        }
                    }
                }
                return (0, rxjs_1.of)(newMatches);
            }
            return (0, rxjs_1.of)([]);
        }));
    }
}
exports.GetNewMatchesToAddInGroupUsecase = GetNewMatchesToAddInGroupUsecase;
