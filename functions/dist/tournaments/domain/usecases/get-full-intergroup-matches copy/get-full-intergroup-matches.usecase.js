"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFullIntergroupMatchesUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetFullIntergroupMatchesUsecase extends usecase_1.Usecase {
    constructor(getIntergroupMatchesUsecase, getIntergroupMatchUsecase, getFixtureOverviewByTournamentUsecase) {
        super();
        this.getIntergroupMatchesUsecase = getIntergroupMatchesUsecase;
        this.getIntergroupMatchUsecase = getIntergroupMatchUsecase;
        this.getFixtureOverviewByTournamentUsecase = getFixtureOverviewByTournamentUsecase;
    }
    call(tournamentId) {
        return this.getFixtureOverviewByTournamentUsecase.call(tournamentId).pipe((0, operators_1.map)((fixtureModel) => {
            const response = [];
            for (const stage of fixtureModel.stages) {
                response.push(this.getIntergroupMatchesUsecase
                    .call({
                    stageId: stage.id || '',
                    tournamentId: tournamentId,
                })
                    .pipe((0, operators_1.map)((t) => {
                    const fullMatches = [];
                    for (const match of t) {
                        fullMatches.push(this.getIntergroupMatchUsecase.call({
                            tournamentId,
                            stageId: stage.id || '',
                            intergroupMatchId: match.id,
                        }));
                    }
                    return fullMatches.length > 0
                        ? (0, rxjs_1.zip)(...fullMatches).pipe((0, operators_1.map)((u) => {
                            return {
                                order: stage.order,
                                id: stage.id,
                                matches: u,
                                //     matches:
                            };
                        }))
                        : (0, rxjs_1.of)([]);
                }), (0, operators_1.mergeMap)((t) => t)));
            }
            return response.length > 0 ? (0, rxjs_1.zip)(...response) : (0, rxjs_1.of)([]);
        }), (0, operators_1.mergeMap)((x) => x), (0, operators_1.map)((x) => {
            const response = {};
            for (const stage of x) {
                if (stage.id && !(stage.id in response)) {
                    response[stage.id || ''] = {
                        order: stage.order,
                        matches: stage.matches,
                    };
                }
            }
            return response;
        }));
    }
}
exports.GetFullIntergroupMatchesUsecase = GetFullIntergroupMatchesUsecase;
