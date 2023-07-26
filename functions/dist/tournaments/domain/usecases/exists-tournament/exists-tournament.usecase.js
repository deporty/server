"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentsByUniqueAttributesUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetTournamentsByUniqueAttributesUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(tournament) {
        const filters = {
            category: {
                operator: '==',
                value: tournament.category,
            },
            edition: {
                operator: '==',
                value: tournament.edition,
            },
            organizationId: {
                operator: '==',
                value: tournament.organizationId,
            },
            tournamentLayoutId: {
                operator: '==',
                value: tournament.tournamentLayoutId,
            },
            version: {
                operator: '==',
                value: tournament.version,
            },
        };
        return this.tournamentContract.filter(filters);
    }
}
exports.GetTournamentsByUniqueAttributesUsecase = GetTournamentsByUniqueAttributesUsecase;
