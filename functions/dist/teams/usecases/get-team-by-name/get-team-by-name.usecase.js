"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamByNameUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetTeamByNameUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(name) {
        return this.teamContract
            .getByFilter([
            {
                property: "name",
                equals: name,
            },
        ])
            .pipe((0, operators_1.map)((teams) => {
            return teams.length > 0 ? teams[0] : undefined;
        }));
    }
}
exports.GetTeamByNameUsecase = GetTeamByNameUsecase;
