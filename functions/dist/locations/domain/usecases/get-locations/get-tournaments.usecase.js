"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentsUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetTournamentsUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(params) {
        return this.tournamentContract.get({
            pageNumber: parseInt(params.pageNumber + ''),
            pageSize: parseInt(params.pageSize + ''),
        });
    }
}
exports.GetTournamentsUsecase = GetTournamentsUsecase;
