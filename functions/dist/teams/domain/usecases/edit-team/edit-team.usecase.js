"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditTeamUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class EditTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(team) {
        return this.teamContract.update(team.id, team);
    }
}
exports.EditTeamUsecase = EditTeamUsecase;
