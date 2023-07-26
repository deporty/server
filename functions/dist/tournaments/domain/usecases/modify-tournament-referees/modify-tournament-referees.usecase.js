"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyTournamentRefereesUsecase = exports.NotAllowedStatusModificationError = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class NotAllowedStatusModificationError extends Error {
    constructor() {
        super();
        this.name = 'NotAllowedStatusModificationError';
        this.message = `The tournament status can be modified.`;
    }
}
exports.NotAllowedStatusModificationError = NotAllowedStatusModificationError;
class ModifyTournamentRefereesUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, updateTournamentUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
    }
    call(param) {
        return this.getTournamentByIdUsecase.call(param.tournamentId).pipe((0, operators_1.mergeMap)((tournament) => {
            tournament.refereeIds = param.refereeIds;
            return this.updateTournamentUsecase.call(tournament);
        }));
    }
}
exports.ModifyTournamentRefereesUsecase = ModifyTournamentRefereesUsecase;
