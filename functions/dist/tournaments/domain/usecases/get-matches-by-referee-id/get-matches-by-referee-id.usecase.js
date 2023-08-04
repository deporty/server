"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMatchesByRefereeIdUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetMatchesByRefereeIdUsecase extends usecase_1.Usecase {
    constructor(matchesByRefereeIdContract) {
        super();
        this.matchesByRefereeIdContract = matchesByRefereeIdContract;
    }
    call(refereeId) {
        return this.matchesByRefereeIdContract.filter({
            refereeId: { operator: "==", value: refereeId },
        });
    }
}
exports.GetMatchesByRefereeIdUsecase = GetMatchesByRefereeIdUsecase;
