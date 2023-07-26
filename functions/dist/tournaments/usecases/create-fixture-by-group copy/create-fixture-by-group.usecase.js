"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFixtureByGroupUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class CreateFixtureByGroupUsecase extends usecase_1.Usecase {
    constructor(tournamentContract) {
        super();
        this.tournamentContract = tournamentContract;
    }
    call(param) {
        return this.tournamentContract.getByIdPopulate(param.tournamentId).pipe((0, operators_1.map)((tournament) => {
            return [];
        }));
    }
}
exports.CreateFixtureByGroupUsecase = CreateFixtureByGroupUsecase;
//# sourceMappingURL=create-fixture-by-group.usecase.js.map