"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlayerUsecase = void 0;
const rxjs_1 = require("rxjs");
const exceptions_1 = require("../../../core/exceptions");
const usecase_1 = require("../../../core/usecase");
class DeletePlayerUsecase extends usecase_1.Usecase {
    constructor(playerContract) {
        super();
        this.playerContract = playerContract;
    }
    call(id) {
        if (!id) {
            return (0, rxjs_1.throwError)(new exceptions_1.VariableNotDefinedException("id"));
        }
        return (0, rxjs_1.of)();
    }
}
exports.DeletePlayerUsecase = DeletePlayerUsecase;
//# sourceMappingURL=delete-player.usecase.js.map