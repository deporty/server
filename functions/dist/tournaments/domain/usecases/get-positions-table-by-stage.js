"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPositionsTableByStageUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetPositionsTableByStageUsecase extends usecase_1.Usecase {
    constructor(getFixtureOverviewByTournamentUsecase, getRegisteredTeamsByTournamentIdUsecase, getIntergroupMatchesUsecase, getPositionsTableUsecase) {
        super();
        this.getFixtureOverviewByTournamentUsecase = getFixtureOverviewByTournamentUsecase;
        this.getRegisteredTeamsByTournamentIdUsecase = getRegisteredTeamsByTournamentIdUsecase;
        this.getIntergroupMatchesUsecase = getIntergroupMatchesUsecase;
        this.getPositionsTableUsecase = getPositionsTableUsecase;
    }
    call(tournamentId) {
        const $registeredTeams = this.getRegisteredTeamsByTournamentIdUsecase
            .call(tournamentId)
            .pipe((0, operators_1.map)((x) => {
            return x.map((y) => {
                return y.team;
            });
        }));
        const $anemicTable = this.getFixtureOverviewByTournamentUsecase.call(tournamentId).pipe((0, operators_1.map)((fixture) => {
            const generalResponse = [];
            for (const stage of fixture.stages) {
                const $intergroupMatches = this.getIntergroupMatchesUsecase.call({
                    stageId: stage.id || '',
                    tournamentId,
                });
                generalResponse.push((0, rxjs_1.zip)($intergroupMatches, (0, rxjs_1.of)(stage.groups)).pipe((0, operators_1.map)(([intergroupMatches, groupedMatches]) => {
                    const tables = [];
                    for (const groupSpecification of groupedMatches) {
                        const teams = groupSpecification.teams;
                        const matches = groupSpecification.matches || [];
                        const matchesI = intergroupMatches
                            .map((x) => {
                            return x.match;
                        })
                            .filter((x) => {
                            return x != undefined;
                        });
                        for (const item of matchesI) {
                            if (item) {
                                matches.push(item);
                            }
                        }
                        tables.push(this.getPositionsTableUsecase
                            .call({
                            availableTeams: teams,
                            matches,
                        })
                            .pipe((0, operators_1.map)((x) => {
                            return {
                                group: groupSpecification.label,
                                table: x,
                            };
                        })));
                    }
                    return tables.length > 0 ? (0, rxjs_1.zip)(...tables) : (0, rxjs_1.of)([]);
                }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
                    return {
                        stage: stage.id || '',
                        tables: x,
                    };
                })));
            }
            return generalResponse.length > 0 ? (0, rxjs_1.zip)(...generalResponse) : (0, rxjs_1.of)([]);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
            const absoluteResponse = {};
            for (const stage of x) {
                absoluteResponse[stage.stage] = {};
                for (const group of stage.tables) {
                    absoluteResponse[stage.stage][group.group] = group.table;
                }
            }
            return absoluteResponse;
        }));
        return (0, rxjs_1.zip)($anemicTable, $registeredTeams).pipe((0, operators_1.map)(([oldTable, registeredTeams]) => {
            const table = Object.assign({}, oldTable);
            for (const stageId in table) {
                if (Object.prototype.hasOwnProperty.call(table, stageId)) {
                    const groups = table[stageId];
                    for (const groupLabel in groups) {
                        for (let i = 0; i < groups[groupLabel].length; i++) {
                            const positions = groups[groupLabel][i];
                            const index = registeredTeams.findIndex((r) => {
                                return r.id === positions.team.id;
                            });
                            groups[groupLabel][i].team = registeredTeams[index];
                        }
                    }
                }
            }
            return table;
        }));
    }
}
exports.GetPositionsTableByStageUsecase = GetPositionsTableByStageUsecase;
