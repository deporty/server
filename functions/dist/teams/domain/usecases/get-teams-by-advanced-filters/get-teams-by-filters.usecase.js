"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamByFiltersUsecase = void 0;
const helpers_1 = require("../../../../core/helpers");
const usecase_1 = require("../../../../core/usecase");
class GetTeamByFiltersUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(filters) {
        return this.teamContract.filter((0, helpers_1.makeFilters)(filters));
    }
}
exports.GetTeamByFiltersUsecase = GetTeamByFiltersUsecase;
