"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentLayoutsByOrganizationIdUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetTournamentLayoutsByOrganizationIdUsecase extends usecase_1.Usecase {
    constructor(tournamentLayoutContract) {
        super();
        this.tournamentLayoutContract = tournamentLayoutContract;
    }
    call(organizationId) {
        return this.tournamentLayoutContract.filter({ organizationId }, {
            organizationId: {
                operator: "==",
                value: organizationId
            }
        });
    }
}
exports.GetTournamentLayoutsByOrganizationIdUsecase = GetTournamentLayoutsByOrganizationIdUsecase;
