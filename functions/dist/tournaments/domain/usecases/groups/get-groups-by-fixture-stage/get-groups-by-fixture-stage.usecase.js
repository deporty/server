"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupsByFixtureStageUsecase = void 0;
const usecase_1 = require("../../../../../core/usecase");
class GetGroupsByFixtureStageUsecase extends usecase_1.Usecase {
    constructor(groupContract) {
        super();
        this.groupContract = groupContract;
    }
    call(param) {
        return this.groupContract.get({
            tournamentId: param.tournamentId,
            fixtureStageId: param.fixtureStageId,
        });
    }
}
exports.GetGroupsByFixtureStageUsecase = GetGroupsByFixtureStageUsecase;
