"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPlayerByDocumentUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetPlayerByDocumentUsecase extends usecase_1.Usecase {
    constructor(playerContract) {
        super();
        this.playerContract = playerContract;
    }
    call(document) {
        return this.playerContract
            .getByFilter([
            {
                property: "document",
                equals: document,
            },
        ])
            .pipe((0, operators_1.map)((players) => {
            return players.length > 0 ? players[0] : undefined;
        }));
    }
}
exports.GetPlayerByDocumentUsecase = GetPlayerByDocumentUsecase;
//# sourceMappingURL=get-player-by-document.usecase.js.map