"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const get_team_by_id_exceptions_1 = require("./get-team-by-id.exceptions");
const usecase_1 = require("../../../../core/usecase");
class GetTeamByIdUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(id) {
        return this.teamContract.getById(id).pipe((0, operators_1.mergeMap)((team) => {
            if (!!team) {
                return (0, rxjs_1.of)(team);
            }
            else {
                return (0, rxjs_1.throwError)(new get_team_by_id_exceptions_1.TeamDoesNotExistError(id));
            }
        }));
    }
}
exports.GetTeamByIdUsecase = GetTeamByIdUsecase;
