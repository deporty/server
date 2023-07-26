"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayersUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
class GetPlayersUsecase extends usecase_1.Usecase {
    constructor(playerContract) {
        super();
        this.playerContract = playerContract;
    }
    call() {
        return this.playerContract.get();
    }
}
exports.GetPlayersUsecase = GetPlayersUsecase;
