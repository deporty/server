"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletePlayerUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exceptions_1 = require("../../../core/exceptions");
const usecase_1 = require("../../../core/usecase");
class DeletePlayerUsecase extends usecase_1.Usecase {
    constructor(playerContract, fileAdapter, getPlayerByIdUsecase) {
        super();
        this.playerContract = playerContract;
        this.fileAdapter = fileAdapter;
        this.getPlayerByIdUsecase = getPlayerByIdUsecase;
    }
    call(id) {
        if (!id) {
            return (0, rxjs_1.throwError)(new exceptions_1.VariableNotDefinedException('id'));
        }
        return this.getPlayerByIdUsecase.call(id).pipe((0, operators_1.map)((player) => {
            if (player.image) {
                return this.fileAdapter.deleteFile(player.image).pipe((0, operators_1.map)((item) => {
                    return this.playerContract.delete(id);
                }), (0, operators_1.mergeMap)((x) => x));
            }
            return this.playerContract.delete(id);
        }), (0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.DeletePlayerUsecase = DeletePlayerUsecase;
