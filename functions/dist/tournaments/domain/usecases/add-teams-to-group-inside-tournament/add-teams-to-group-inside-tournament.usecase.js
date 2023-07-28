"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTeamsToGroupInsideTournamentUsecase = exports.ThereAreTeamRegisteredPreviuslyError = exports.TeamAreRegisteredInOtherGroupError = exports.TeamAreNotRegisteredError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class TeamAreNotRegisteredError extends Error {
    constructor(teamIds) {
        super();
        this.name = "TeamAreNotRegisteredError";
        this.message = `The following teams are not registerd in the tournament: ${teamIds.join(", ")} `;
        this.data = teamIds;
    }
}
exports.TeamAreNotRegisteredError = TeamAreNotRegisteredError;
class TeamAreRegisteredInOtherGroupError extends Error {
    constructor(data) {
        super();
        this.data = data;
        this.name = "TeamAreRegisteredInOtherGroupError";
        this.message = `There are teams wich are registered in other groups`;
    }
}
exports.TeamAreRegisteredInOtherGroupError = TeamAreRegisteredInOtherGroupError;
class ThereAreTeamRegisteredPreviuslyError extends Error {
    constructor(data) {
        super();
        this.data = data;
        this.name = "ThereAreTeamRegisteredPreviuslyError";
        this.message = `There are teams wich are registered in the same group`;
    }
}
exports.ThereAreTeamRegisteredPreviuslyError = ThereAreTeamRegisteredPreviuslyError;
class AddTeamsToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(getGroupsByFixtureStageUsecase, getRegisteredTeamsByTournamentIdUsecase, groupContract, completeGroupMatchesUsecase) {
        super();
        this.getGroupsByFixtureStageUsecase = getGroupsByFixtureStageUsecase;
        this.getRegisteredTeamsByTournamentIdUsecase = getRegisteredTeamsByTournamentIdUsecase;
        this.groupContract = groupContract;
        this.completeGroupMatchesUsecase = completeGroupMatchesUsecase;
    }
    ambulanc(groups, param) {
        const currentGroup = groups.find((g) => g.id === param.groupId);
        const otherGroups = groups.filter((g) => g.id !== currentGroup.id);
        const teamsInOtherGroups = {};
        for (const teamId of param.teamIds) {
            for (const group of otherGroups) {
                const existingGroup = group.teamIds.includes(teamId);
                if (existingGroup) {
                    teamsInOtherGroups[teamId] = group;
                }
            }
        }
        if (Object.keys(teamsInOtherGroups).length !== 0) {
            return (0, rxjs_1.throwError)(new TeamAreRegisteredInOtherGroupError(teamsInOtherGroups));
        }
        return (0, rxjs_1.of)(currentGroup);
    }
    call(param) {
        console.log("Gonorrea ", param);
        return this.getRegisteredTeamsByTournamentIdUsecase
            .call(param.tournamentId)
            .pipe((0, operators_1.mergeMap)((registeredTeams) => {
            const noRegisteredTeams = [];
            for (const tid of param.teamIds) {
                const registeredTeam = registeredTeams.find((x) => x.teamId == tid);
                if (!registeredTeam) {
                    noRegisteredTeams.push(tid);
                }
                else if (registeredTeam.status === "pre-registered") {
                    noRegisteredTeams.push(tid);
                }
            }
            if (noRegisteredTeams.length > 0) {
                return (0, rxjs_1.throwError)(new TeamAreNotRegisteredError(noRegisteredTeams));
            }
            return this.getGroupsByFixtureStageUsecase
                .call({
                tournamentId: param.tournamentId,
                fixtureStageId: param.fixtureStageId,
            })
                .pipe((0, operators_1.mergeMap)((groups) => {
                return this.ambulanc(groups, param);
            }), (0, operators_1.mergeMap)((currentGroup) => {
                const teamsToAdd = [];
                const prevTeams = [];
                const groupTeamIds = currentGroup.teamIds;
                for (const teamId of param.teamIds) {
                    const index = groupTeamIds.indexOf(teamId);
                    if (index == -1) {
                        teamsToAdd.push(teamId);
                    }
                    else {
                        prevTeams.push(teamId);
                    }
                }
                if (prevTeams.length > 0) {
                    return (0, rxjs_1.throwError)(new ThereAreTeamRegisteredPreviuslyError(prevTeams));
                }
                currentGroup.teamIds.push(...teamsToAdd);
                return this.groupContract
                    .update({
                    fixtureStageId: param.fixtureStageId,
                    tournamentId: param.tournamentId,
                    groupId: param.groupId,
                }, currentGroup)
                    .pipe((0, operators_1.mergeMap)(() => {
                    return this.completeGroupMatchesUsecase.call({
                        fixtureStageId: param.fixtureStageId,
                        groupId: param.groupId,
                        tournamentId: param.tournamentId,
                        teamIds: currentGroup.teamIds,
                    });
                }), (0, operators_1.map)(() => {
                    return currentGroup;
                }));
            }));
        }));
    }
}
exports.AddTeamsToGroupInsideTournamentUsecase = AddTeamsToGroupInsideTournamentUsecase;
