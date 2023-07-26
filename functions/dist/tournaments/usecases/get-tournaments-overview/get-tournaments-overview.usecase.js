"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentsOverviewUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
class GetTournamentsOverviewUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call() {
        return this.tournamentContract.getAllSummaryTournaments();
    }
}
exports.GetTournamentsOverviewUsecase = GetTournamentsOverviewUsecase;
