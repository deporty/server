"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamByAdvancedFiltersUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetTeamByAdvancedFiltersUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(filters) {
        return this.teamContract.filter(filters);
    }
}
exports.GetTeamByAdvancedFiltersUsecase = GetTeamByAdvancedFiltersUsecase;
