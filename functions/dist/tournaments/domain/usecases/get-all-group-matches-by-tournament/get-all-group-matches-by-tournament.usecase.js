"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllGroupMatchesByTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class GetAllGroupMatchesByTournamentUsecase extends usecase_1.Usecase {
    constructor(getFixtureStagesByTournamentUsecase, getGroupsByFixtureStageUsecase, getGroupMatchesUsecase) {
        super();
        this.getFixtureStagesByTournamentUsecase = getFixtureStagesByTournamentUsecase;
        this.getGroupsByFixtureStageUsecase = getGroupsByFixtureStageUsecase;
        this.getGroupMatchesUsecase = getGroupMatchesUsecase;
    }
    call(param) {
        return this.getFixtureStagesByTournamentUsecase
            .call(param.tournamentId)
            .pipe((0, operators_1.mergeMap)((fixtureStages) => {
            const $groups = this.getAllGroupsInTournament(fixtureStages, param.tournamentId);
            return $groups;
        }), (0, operators_1.mergeMap)((groups) => {
            const $groupMatches = this.getGroupMatches(groups, param.tournamentId, param.status);
            return $groupMatches;
        }));
    }
    getAllGroupsInTournament(fixtureStages, tournamentId) {
        return fixtureStages.length > 0
            ? (0, rxjs_1.zip)(...fixtureStages.map((stage) => {
                return this.getGroupsByFixtureStageUsecase.call({
                    fixtureStageId: stage.id,
                    tournamentId: tournamentId,
                });
            })).pipe((0, operators_1.map)((allGroups) => {
                return allGroups.reduce((prev, curr) => {
                    curr.push(...prev);
                    return curr;
                }, []);
            }))
            : (0, rxjs_1.of)([]);
    }
    getGroupMatches(groups, tournamentId, status) {
        return groups.length > 0
            ? (0, rxjs_1.zip)(...groups.map((group) => {
                return this.getGroupMatchesUsecase.call({
                    fixtureStageId: group.fixtureStageId,
                    tournamentId,
                    groupId: group.id,
                    states: status,
                });
            })).pipe((0, operators_1.map)((m) => {
                return m.reduce((prev, cur) => {
                    cur.push(...prev);
                    return cur;
                }, []);
            }))
            : (0, rxjs_1.of)([]);
    }
}
exports.GetAllGroupMatchesByTournamentUsecase = GetAllGroupMatchesByTournamentUsecase;
