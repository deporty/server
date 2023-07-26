"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentTournamentsUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetCurrentTournamentsUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call() {
        const filters = {
            status: {
                operator: 'in',
                value: ['running', 'check-in'],
            },
        };
        return this.tournamentContract.filter(filters);
    }
}
exports.GetCurrentTournamentsUsecase = GetCurrentTournamentsUsecase;
