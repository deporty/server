"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditMatchToGroupInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../../core/helpers");
const usecase_1 = require("../../../../core/usecase");
class EditMatchToGroupInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, fileAdapter) {
        super();
        this.tournamentContract = tournamentContract;
        this.fileAdapter = fileAdapter;
    }
    call(param) {
        const prefixSignaturePath = `tournaments/${param.tournamentId}/stages/${param.stageId}/groups/${param.groupLabel}/matches/${param.match.teamA.id}-${param.match.teamB.id}`;
        const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
        const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
        const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;
        const signatures = [
            (0, helpers_1.convertToImage)(param.match['captainASignature'], captainASignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)(param.match['captainBSignature'], captainBSignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)(param.match['judgeSignature'], judgeSignaturePath, this.fileAdapter),
        ];
        return (0, rxjs_1.zip)(...signatures).pipe((0, operators_1.map)((data) => {
            param.match.captainASignature = data[0];
            param.match.captainBSignature = data[1];
            param.match.judgeSignature = data[2];
            return this.tournamentContract.editMatchOfGroupInsideTournament(param.tournamentId, param.stageId, param.groupIndex, param.match);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.EditMatchToGroupInsideTournamentUsecase = EditMatchToGroupInsideTournamentUsecase;
