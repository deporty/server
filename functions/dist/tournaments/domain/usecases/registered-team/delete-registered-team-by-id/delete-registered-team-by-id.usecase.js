"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRegisteredTeamByIdUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../../core/usecase");
class DeleteRegisteredTeamByIdUsecase extends usecase_1.Usecase {
    constructor(registeredTeamsContract) {
        super();
        this.registeredTeamsContract = registeredTeamsContract;
    }
    call(params) {
        return this.registeredTeamsContract
            .delete({
            tournamentId: params.tournamentId,
        }, params.registeredTeamId)
            .pipe((0, operators_1.map)(() => {
            return params.registeredTeamId;
        }));
    }
}
exports.DeleteRegisteredTeamByIdUsecase = DeleteRegisteredTeamByIdUsecase;
