"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamsUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
class GetTeamsUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call() {
        return this.teamContract.get();
    }
}
exports.GetTeamsUsecase = GetTeamsUsecase;
