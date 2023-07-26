"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyTournamentStatusUsecase = exports.NotAllowedStatusModificationError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class NotAllowedStatusModificationError extends Error {
    constructor() {
        super();
        this.name = 'NotAllowedStatusModificationError';
        this.message = `The tournament status can be modified.`;
    }
}
exports.NotAllowedStatusModificationError = NotAllowedStatusModificationError;
class ModifyTournamentStatusUsecase extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase, updateTournamentUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.updateTournamentUsecase = updateTournamentUsecase;
    }
    call(param) {
        return this.getTournamentByIdUsecase.call(param.tournamentId).pipe((0, operators_1.mergeMap)((tournament) => {
            if (tournament.status == 'finished' && param.status != 'finished') {
                return (0, rxjs_1.throwError)(new NotAllowedStatusModificationError());
            }
            if (tournament.status == 'deleted' && param.status != 'deleted') {
                return (0, rxjs_1.throwError)(new NotAllowedStatusModificationError());
            }
            if (tournament.status == 'canceled' &&
                (param.status == 'check-in' ||
                    param.status == 'running' ||
                    param.status == 'finished' ||
                    param.status == 'draft')) {
                return (0, rxjs_1.throwError)(new NotAllowedStatusModificationError());
            }
            if (tournament.status == 'running' &&
                (param.status == 'check-in' || param.status == 'draft')) {
                return (0, rxjs_1.throwError)(new NotAllowedStatusModificationError());
            }
            if (param.status == 'running' &&
                (tournament.status == 'check-in' || tournament.status == 'draft')) {
                tournament.startsDate = new Date();
            }
            tournament.status = param.status;
            return this.updateTournamentUsecase.call(tournament);
        }));
    }
}
exports.ModifyTournamentStatusUsecase = ModifyTournamentStatusUsecase;
