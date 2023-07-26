"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTournamentLayoutUsecase = exports.TournamentLayoutDoesNotExistsError = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
class TournamentLayoutDoesNotExistsError extends Error {
    constructor() {
        super();
        this.name = 'TournamentLayoutDoesNotExistsError';
        this.message = 'The tournament layout does not exists';
    }
}
exports.TournamentLayoutDoesNotExistsError = TournamentLayoutDoesNotExistsError;
class EditTournamentLayoutUsecase extends usecase_1.Usecase {
    constructor(tournamentLayoutContract, getTournamentLayoutByIdUsecase) {
        super();
        this.tournamentLayoutContract = tournamentLayoutContract;
        this.getTournamentLayoutByIdUsecase = getTournamentLayoutByIdUsecase;
    }
    call(tournamentLayout) {
        return this.getTournamentLayoutByIdUsecase
            .call({
            organizationId: tournamentLayout.organizationId,
            tournamentLayoutId: tournamentLayout.id,
        })
            .pipe((0, operators_1.mergeMap)((prevTournamentLayout) => {
            const toSave = Object.assign(Object.assign({}, prevTournamentLayout), { fixtureStagesConfiguration: tournamentLayout.fixtureStagesConfiguration, name: tournamentLayout.name, description: tournamentLayout.description, categories: tournamentLayout.categories, editions: tournamentLayout.editions, registeredTeamsVisibleStatus: tournamentLayout.registeredTeamsVisibleStatus });
            if (toSave.editions == null) {
                toSave.editions = ['Única'];
            }
            return this.tournamentLayoutContract
                .update({
                organizationId: tournamentLayout.organizationId,
                tournamentLayoutId: tournamentLayout.id,
            }, toSave)
                .pipe((0, operators_1.map)(() => {
                return toSave;
            }));
        }));
    }
}
exports.EditTournamentLayoutUsecase = EditTournamentLayoutUsecase;
