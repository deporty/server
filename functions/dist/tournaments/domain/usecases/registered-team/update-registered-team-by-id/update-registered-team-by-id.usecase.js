"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRegisteredTeamByIdUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class UpdateRegisteredTeamByIdUsecase extends usecase_1.Usecase {
    constructor(getRegisteredTeamByIdUsecase, registeredTeamsContract) {
        super();
        this.getRegisteredTeamByIdUsecase = getRegisteredTeamByIdUsecase;
        this.registeredTeamsContract = registeredTeamsContract;
    }
    call(params) {
        return this.getRegisteredTeamByIdUsecase
            .call({
            tournamentId: params.tournamentId,
            registeredTeamId: params.registeredTeam.id,
        })
            .pipe((0, operators_1.mergeMap)((data) => {
            return this.registeredTeamsContract
                .update({
                tournamentId: params.tournamentId,
            }, params.registeredTeam)
                .pipe((0, operators_1.map)(() => params.registeredTeam));
        }));
    }
}
exports.UpdateRegisteredTeamByIdUsecase = UpdateRegisteredTeamByIdUsecase;
