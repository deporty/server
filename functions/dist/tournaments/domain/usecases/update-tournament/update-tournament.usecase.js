"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTournamentUsecase = exports.TournamentAlreadyExistsError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class TournamentAlreadyExistsError extends Error {
    constructor() {
        super();
        this.name = 'TournamentAlreadyExistsError';
        this.message = `The tournament with these properties already exists. Review the data and try again`;
    }
}
exports.TournamentAlreadyExistsError = TournamentAlreadyExistsError;
class UpdateTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, getTournamentsByUniqueAttributesUsecase) {
        super();
        this.tournamentContract = tournamentContract;
        this.getTournamentsByUniqueAttributesUsecase = getTournamentsByUniqueAttributesUsecase;
    }
    call(tournament) {
        return this.getTournamentsByUniqueAttributesUsecase.call(tournament).pipe((0, operators_1.mergeMap)((tournaments) => {
            const othersTournaments = tournaments.filter((x) => x.id !== tournament.id);
            if (othersTournaments.length > 0) {
                return (0, rxjs_1.throwError)(new TournamentAlreadyExistsError());
            }
            return this.tournamentContract.update(tournament.id, tournament);
        }));
    }
}
exports.UpdateTournamentUsecase = UpdateTournamentUsecase;
