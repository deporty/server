"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRegisteredTeamsByIdIdUsecase = exports.RegisteredTeamDoesNotExist = void 0;
const rxjs_1 = require("rxjs");
const usecase_1 = require("../../../../../core/usecase");
const operators_1 = require("rxjs/operators");
class RegisteredTeamDoesNotExist extends Error {
    constructor() {
        super();
        this.name = 'RegisteredTeamDoesNotExist';
        this.message = `The registered team does not exist`;
    }
}
exports.RegisteredTeamDoesNotExist = RegisteredTeamDoesNotExist;
class GetRegisteredTeamsByIdIdUsecase extends usecase_1.Usecase {
    constructor(registeredTeamsContract) {
        super();
        this.registeredTeamsContract = registeredTeamsContract;
    }
    call(params) {
        return this.registeredTeamsContract
            .getById({
            tournamentId: params.tournamentId,
        }, params.registeredTeamId)
            .pipe((0, operators_1.mergeMap)((data) => {
            if (!data) {
                return (0, rxjs_1.throwError)(new RegisteredTeamDoesNotExist());
            }
            return (0, rxjs_1.of)(data);
        }));
    }
}
exports.GetRegisteredTeamsByIdIdUsecase = GetRegisteredTeamsByIdIdUsecase;
