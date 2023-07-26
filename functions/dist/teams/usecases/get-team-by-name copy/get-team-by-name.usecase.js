"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamByNameUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetTeamByNameUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(name) {
        return this.teamContract
            .filter({
            name: {
                operator: '==',
                value: name,
            },
        })
            .pipe((0, operators_1.map)((teams) => {
            if (teams.length === 0) {
                return (0, rxjs_1.throwError)(new Error(`The team ${name} does not exist.`));
            }
            return (0, rxjs_1.of)(teams[0]);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.GetTeamByNameUsecase = GetTeamByNameUsecase;
