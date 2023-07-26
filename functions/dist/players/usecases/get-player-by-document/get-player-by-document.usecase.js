"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayerByDocumentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetPlayerByDocumentUsecase extends usecase_1.Usecase {
    constructor(playerContract) {
        super();
        this.playerContract = playerContract;
    }
    call(document) {
        return document
            ? this.playerContract
                .filter({
                document: {
                    operator: '==',
                    value: document,
                },
            })
                .pipe((0, operators_1.map)((players) => {
                return players.length > 0 ? players[0] : undefined;
            }))
            : (0, rxjs_1.of)(undefined);
    }
}
exports.GetPlayerByDocumentUsecase = GetPlayerByDocumentUsecase;
