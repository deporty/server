"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTeamsToTournamentUsecase = exports.TeamsArrayEmptyError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class TeamsArrayEmptyError extends Error {
    constructor() {
        super(`The team ids array is empty`);
        this.name = 'TeamsArrayEmptyError';
    }
}
exports.TeamsArrayEmptyError = TeamsArrayEmptyError;
class AddTeamsToTournamentUsecase extends usecase_1.Usecase {
    constructor(registeredTeamsContract, teamContract) {
        super();
        this.registeredTeamsContract = registeredTeamsContract;
        this.teamContract = teamContract;
    }
    call(param) {
        if (param.teamIds.length == 0) {
            return (0, rxjs_1.throwError)(new TeamsArrayEmptyError());
        }
        const teams = [];
        for (const teamId of param.teamIds) {
            const members = this.teamContract.getMembersByTeam(teamId).pipe((0, operators_1.map)((members) => {
                const registeredTeam = {
                    enrollmentDate: new Date(),
                    members: members.map((x) => x.member),
                    teamId,
                    tournamentId: param.tournamentId,
                    status: 'pre-registered'
                };
                return registeredTeam;
            }), (0, operators_1.mergeMap)((registeredTeam) => {
                return this.registeredTeamsContract
                    .save({ tournamentId: param.tournamentId }, registeredTeam)
                    .pipe((0, operators_1.map)((id) => {
                    return Object.assign(Object.assign({}, registeredTeam), { id });
                }));
            }));
            teams.push(members);
        }
        return (0, rxjs_1.zip)(...teams);
    }
}
exports.AddTeamsToTournamentUsecase = AddTeamsToTournamentUsecase;
