"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsignPlayerToTeamUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const asign_player_to_team_exceptions_1 = require("./asign-player-to-team.exceptions");
class AsignPlayerToTeamUsecase extends usecase_1.Usecase {
    constructor(teamContract, getTeamByNameUsecase, getPlayerByDocumentUsecase) {
        super();
        this.teamContract = teamContract;
        this.getTeamByNameUsecase = getTeamByNameUsecase;
        this.getPlayerByDocumentUsecase = getPlayerByDocumentUsecase;
    }
    call(team) {
        const $getPlayerByDocumentUsecase = this.getPlayerByDocumentUsecase.call(team.player.document);
        const $getTeamByNameUsecase = this.getTeamByNameUsecase.call(team.teamName);
        return (0, rxjs_1.zip)($getPlayerByDocumentUsecase, $getTeamByNameUsecase).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((_zip) => {
            const player = _zip[0];
            const team = _zip[1];
            if (team.members == undefined) {
                team.members = [];
            }
            const existsPlayer = team.members.filter((p) => {
                return p.document && p.document == player.document;
            }).length > 0;
            if (!existsPlayer) {
                team.members.push(player);
                this.teamContract.save(team);
            }
            else {
                return (0, rxjs_1.throwError)(new asign_player_to_team_exceptions_1.PlayerIsAlreadyInTeamException(player.document));
            }
            return (0, rxjs_1.of)();
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.AsignPlayerToTeamUsecase = AsignPlayerToTeamUsecase;
//# sourceMappingURL=asign-player-to-team.usecase.js.map