"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyRegisteredTeamStatusUsecase = exports.NotAllowedStatusModificationError = void 0;
const tournaments_1 = require("@deporty-org/entities/tournaments");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class NotAllowedStatusModificationError extends Error {
    constructor() {
        super();
        this.name = 'NotAllowedStatusModificationError';
        this.message = `The registered team status can be modified.`;
    }
}
exports.NotAllowedStatusModificationError = NotAllowedStatusModificationError;
class ModifyRegisteredTeamStatusUsecase extends usecase_1.Usecase {
    constructor(getRegisteredTeamsByIdIdUsecase, updateRegisteredTeamByIdUsecase) {
        super();
        this.getRegisteredTeamsByIdIdUsecase = getRegisteredTeamsByIdIdUsecase;
        this.updateRegisteredTeamByIdUsecase = updateRegisteredTeamByIdUsecase;
    }
    call(param) {
        return this.getRegisteredTeamsByIdIdUsecase
            .call({
            tournamentId: param.tournamentId,
            registeredTeamId: param.registeredTeamId,
        })
            .pipe((0, operators_1.mergeMap)((registeredTeam) => {
            if (!tournaments_1.REGISTERED_TEAM_STATUS.includes(param.status)) {
                return (0, rxjs_1.throwError)(new NotAllowedStatusModificationError());
            }
            if (registeredTeam.status == 'enabled' && param.status != 'enabled') {
                return (0, rxjs_1.throwError)(new NotAllowedStatusModificationError());
            }
            registeredTeam.status = param.status;
            return this.updateRegisteredTeamByIdUsecase.call({
                tournamentId: param.tournamentId,
                registeredTeam,
            });
        }));
    }
}
exports.ModifyRegisteredTeamStatusUsecase = ModifyRegisteredTeamStatusUsecase;
