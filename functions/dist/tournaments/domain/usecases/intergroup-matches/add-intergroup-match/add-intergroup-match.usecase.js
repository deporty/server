"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIntergroupMatchUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
const operators_1 = require("rxjs/operators");
class AddIntergroupMatchUsecase extends usecase_1.Usecase {
    constructor(intergroupMatchContract) {
        super();
        this.intergroupMatchContract = intergroupMatchContract;
    }
    call(param) {
        const r = {
            fixtureStageId: param.fixtureStageId,
            match: {
                status: 'editing',
                teamAId: param.teamAId,
                teamBId: param.teamBId,
            },
        };
        return this.intergroupMatchContract
            .save({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
        }, Object.assign({}, r))
            .pipe((0, operators_1.map)((id) => {
            return Object.assign(Object.assign({}, r), { id });
        }));
    }
}
exports.AddIntergroupMatchUsecase = AddIntergroupMatchUsecase;
