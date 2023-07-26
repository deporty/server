"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentsByOrganizationAndTournamentLayoutUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetTournamentsByOrganizationAndTournamentLayoutUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(params) {
        const filters = {
            organizationId: {
                operator: '==',
                value: params.organizationId,
            },
            tournamentLayoutId: {
                operator: '==',
                value: params.tournamentLayoutId,
            },
        };
        if (!params.includeDraft) {
            filters['status'] = {
                operator: 'not-in',
                value: ['draft', 'deleted'],
            };
        }
        return this.tournamentContract.filter(filters);
    }
}
exports.GetTournamentsByOrganizationAndTournamentLayoutUsecase = GetTournamentsByOrganizationAndTournamentLayoutUsecase;
