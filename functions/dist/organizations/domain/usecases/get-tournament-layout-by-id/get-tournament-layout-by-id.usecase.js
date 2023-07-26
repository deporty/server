"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentLayoutByIdUsecase = exports.TournamentLayoutNotFoundError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class TournamentLayoutNotFoundError extends Error {
    constructor() {
        super();
        this.name = 'TournamentLayoutNotFoundError';
        this.message = `The tournament layout was not found.`;
    }
}
exports.TournamentLayoutNotFoundError = TournamentLayoutNotFoundError;
class GetTournamentLayoutByIdUsecase extends usecase_1.Usecase {
    constructor(tournamentLayoutContract) {
        super();
        this.tournamentLayoutContract = tournamentLayoutContract;
    }
    call(params) {
        return this.tournamentLayoutContract
            .getById({
            organizationId: params.organizationId,
        }, params.tournamentLayoutId)
            .pipe((0, operators_1.mergeMap)((tournamentLayout) => {
            if (!tournamentLayout) {
                return (0, rxjs_1.throwError)(new TournamentLayoutNotFoundError());
            }
            return (0, rxjs_1.of)(tournamentLayout);
        }));
    }
}
exports.GetTournamentLayoutByIdUsecase = GetTournamentLayoutByIdUsecase;
