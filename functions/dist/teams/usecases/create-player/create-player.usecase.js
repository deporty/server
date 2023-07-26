"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTeamUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const create_team_exceptions_1 = require("./create-team.exceptions");
class CreateTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract, getTeamByDocumentUsecase, getTeamByEmailUsecase) {
        super();
        this.teamContract = teamContract;
        this.getTeamByDocumentUsecase = getTeamByDocumentUsecase;
        this.getTeamByEmailUsecase = getTeamByEmailUsecase;
    }
    call(team) {
        return this.getTeamByDocumentUsecase.call(team.name).pipe((0, operators_1.map)((teamPrev) => {
            if (teamPrev) {
                return (0, rxjs_1.throwError)(new create_team_exceptions_1.TeamAlreadyExistsException(teamPrev.name));
            }
            else {
                return this.teamContract.save(team);
            }
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.CreateTeamUsecase = CreateTeamUsecase;
//# sourceMappingURL=create-player.usecase.js.map