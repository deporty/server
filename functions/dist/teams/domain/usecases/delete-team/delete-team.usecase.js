"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteTeamUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exceptions_1 = require("../../../../core/exceptions");
const usecase_1 = require("../../../../core/usecase");
class DeleteTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract, getTeamByIdUsecase, fileAdapter) {
        super();
        this.teamContract = teamContract;
        this.getTeamByIdUsecase = getTeamByIdUsecase;
        this.fileAdapter = fileAdapter;
    }
    call(id) {
        if (!id) {
            return (0, rxjs_1.throwError)(new exceptions_1.VariableNotDefinedException('id'));
        }
        return this.getTeamByIdUsecase.call(id).pipe((0, operators_1.map)((player) => {
            if (player.shield) {
                return this.fileAdapter.deleteFile(player.shield).pipe((0, operators_1.map)((item) => {
                    return this.teamContract.delete(id);
                }), (0, operators_1.mergeMap)((x) => x));
            }
            return this.teamContract.delete(id);
        }), (0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.DeleteTeamUsecase = DeleteTeamUsecase;
