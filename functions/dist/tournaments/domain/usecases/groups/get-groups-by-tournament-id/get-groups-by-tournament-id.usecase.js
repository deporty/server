"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupsByTournamentIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class GetGroupsByTournamentIdUsecase extends usecase_1.Usecase {
    constructor(getGroupsByFixtureStageUsecase, getFixtureStagesByTournamentUsecase) {
        super();
        this.getGroupsByFixtureStageUsecase = getGroupsByFixtureStageUsecase;
        this.getFixtureStagesByTournamentUsecase = getFixtureStagesByTournamentUsecase;
    }
    call(tournamentId) {
        return this.getFixtureStagesByTournamentUsecase.call(tournamentId).pipe((0, operators_1.mergeMap)((fixtureStages) => {
            if (fixtureStages.length == 0) {
                return (0, rxjs_1.of)([]);
            }
            return (0, rxjs_1.zip)(...fixtureStages.map((fixtureStage) => {
                return this.getGroupsByFixtureStageUsecase
                    .call({
                    tournamentId,
                    fixtureStageId: fixtureStage.id,
                })
                    .pipe((0, operators_1.map)((groups) => {
                    return {
                        fixtureStage,
                        groups,
                    };
                }));
            }));
        }), (0, operators_1.map)((data) => {
            return data.reduce((previousValue, currentValue) => {
                previousValue[currentValue.fixtureStage.id] = {
                    fixtureStage: currentValue.fixtureStage,
                    groups: currentValue.groups,
                };
                return previousValue;
            }, {});
        }));
    }
}
exports.GetGroupsByTournamentIdUsecase = GetGroupsByTournamentIdUsecase;
