"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentLayouts = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetTournamentLayouts extends usecase_1.Usecase {
    constructor(tournamentLayoutContract) {
        super();
        this.tournamentLayoutContract = tournamentLayoutContract;
    }
    call(organizationId) {
        throw new Error('Method not implemented.');
    }
}
exports.GetTournamentLayouts = GetTournamentLayouts;
