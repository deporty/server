"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayerByIdUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const get_player_by_id_exceptions_1 = require("./get-player-by-id.exceptions");
class GetPlayerByIdUsecase extends usecase_1.Usecase {
    constructor(playerContract) {
        super();
        this.playerContract = playerContract;
    }
    call(id) {
        return this.playerContract.getById(id).pipe((0, operators_1.mergeMap)((player) => {
            if (player) {
                return (0, rxjs_1.of)(player);
            }
            return (0, rxjs_1.throwError)(new get_player_by_id_exceptions_1.PlayerDoesNotExistError(id));
        }));
    }
}
exports.GetPlayerByIdUsecase = GetPlayerByIdUsecase;
