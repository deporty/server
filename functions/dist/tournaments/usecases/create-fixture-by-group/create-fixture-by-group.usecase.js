"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFixtureByGroupUsecase = void 0;
const fs = require("fs");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class CreateFixtureByGroupUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, updateTournamentUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
    }
    call(param) {
        return this.getTournamentByIdUsecase.call(param.tournamentId).pipe((0, operators_1.catchError)((error) => (0, rxjs_1.throwError)(error)), (0, operators_1.map)((tournament) => {
            return Object.assign(Object.assign({}, this.getTeamsAndMatches(tournament, param.fixtureStageOrder, param.groupLabel)), { tournament });
        }), (0, operators_1.map)((data) => {
            const { teams, matches, group, tournament, } = data;
            const matchesTemp = !!matches ? [...matches] : [];
            for (let i = 0; i < teams.length - 1; i++) {
                const teamA = teams[i];
                for (let j = i + 1; j < teams.length; j++) {
                    const teamB = teams[j];
                    const exists = existSMatchInList(teamA, teamB, matchesTemp);
                    if (!exists) {
                        matchesTemp.push({
                            teamA,
                            teamB,
                        });
                    }
                }
            }
            return { matches: matchesTemp, tournament, group };
        }), (0, operators_1.map)((data) => {
            const matches = data.matches;
            const tournament = data.tournament;
            const group = data.group;
            if (!group.matches) {
                group.matches = [...matches];
            }
            else {
                for (const match of matches) {
                    if (!existSMatchInList(match.teamA, match.teamB, group.matches)) {
                        group.matches.push(match);
                    }
                }
            }
            fs.writeFileSync('klaus.json', JSON.stringify(tournament, null, 2));
            // return of(matches);
            return this.updateTournamentUsecase.call(tournament).pipe((0, operators_1.map)(() => {
                return matches;
            }));
        }), (0, operators_1.mergeMap)((x) => x));
        function existSMatchInList(teamA, teamB, matches) {
            return (matches.filter((match) => {
                return ((match.teamA.id === teamA.id && match.teamB.id === teamB.id) ||
                    (match.teamA.id === teamB.id && match.teamB.id === teamA.id));
            }).length > 0);
        }
    }
    getTeamsAndMatches(tournament, fixtureStageOrder, groupLabel) {
        var _a;
        const stage = (_a = tournament.fixture) === null || _a === void 0 ? void 0 : _a.stages.filter((stage) => {
            return stage.order == fixtureStageOrder;
        }).pop();
        const group = !!stage
            ? stage.groups
                .filter((group) => {
                return group.label.toUpperCase() === groupLabel.toUpperCase();
            })
                .pop()
            : null;
        const teams = group === null || group === void 0 ? void 0 : group.teams;
        const matches = group === null || group === void 0 ? void 0 : group.matches;
        return { teams, matches, group };
    }
}
exports.CreateFixtureByGroupUsecase = CreateFixtureByGroupUsecase;
