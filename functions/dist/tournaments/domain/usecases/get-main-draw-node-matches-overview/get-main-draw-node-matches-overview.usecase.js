"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMainDrawNodeMatchesoverviewUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetMainDrawNodeMatchesoverviewUsecase extends usecase_1.Usecase {
    constructor(nodeMatchContract) {
        super();
        this.nodeMatchContract = nodeMatchContract;
    }
    call(tournamentId) {
        return this.nodeMatchContract.filter({
            tournamentId,
        }, {
            tournamentId: {
                operator: '==',
                value: tournamentId,
            },
        });
    }
}
exports.GetMainDrawNodeMatchesoverviewUsecase = GetMainDrawNodeMatchesoverviewUsecase;
