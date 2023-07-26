"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamByEmailUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetTeamByEmailUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(email) {
        return this.teamContract
            .getByFilter([
            {
                property: "email",
                equals: email,
            },
        ])
            .pipe((0, operators_1.map)((teams) => {
            return teams.length > 0 ? teams[0] : undefined;
        }));
    }
}
exports.GetTeamByEmailUsecase = GetTeamByEmailUsecase;
//# sourceMappingURL=get-player-by-email.usecase.js.map