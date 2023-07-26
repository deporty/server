"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTeamByDocumentUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class GetTeamByDocumentUsecase extends usecase_1.Usecase {
    constructor(teamContract) {
        super();
        this.teamContract = teamContract;
    }
    call(document) {
        console.log(this.teamContract);
        return this.teamContract
            .getByFilter([
            {
                property: "document",
                equals: document,
            },
        ])
            .pipe((0, operators_1.map)((teams) => {
            return teams.length > 0 ? teams[0] : undefined;
        }));
    }
}
exports.GetTeamByDocumentUsecase = GetTeamByDocumentUsecase;
//# sourceMappingURL=get-player-by-document.usecase.js.map