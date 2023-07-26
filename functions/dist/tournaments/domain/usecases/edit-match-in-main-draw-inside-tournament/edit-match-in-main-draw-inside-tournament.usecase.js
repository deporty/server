"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditMatchInMainDrawInsideTournamentUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../../core/helpers");
const usecase_1 = require("../../../../core/usecase");
class EditMatchInMainDrawInsideTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, fileAdapter) {
        super();
        this.tournamentContract = tournamentContract;
        this.fileAdapter = fileAdapter;
    }
    call(param) {
        var _a, _b, _c;
        const prefixSignaturePath = `tournaments/${param.tournamentId}/main-draw/${param.nodeMatch.id}`;
        const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
        const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
        const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;
        const signatures = [
            (0, helpers_1.convertToImage)((_a = param.nodeMatch.match) === null || _a === void 0 ? void 0 : _a.captainASignature, captainASignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)((_b = param.nodeMatch.match) === null || _b === void 0 ? void 0 : _b.captainBSignature, captainBSignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)((_c = param.nodeMatch.match) === null || _c === void 0 ? void 0 : _c.judgeSignature, judgeSignaturePath, this.fileAdapter),
        ];
        return (0, rxjs_1.zip)(...signatures).pipe((0, operators_1.map)((data) => {
            if (param.nodeMatch.match) {
                param.nodeMatch.match.captainASignature = data[0];
                param.nodeMatch.match.captainBSignature = data[1];
                param.nodeMatch.match.judgeSignature = data[2];
            }
            return this.tournamentContract.editNodeMatch(param.tournamentId, param.nodeMatch);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.EditMatchInMainDrawInsideTournamentUsecase = EditMatchInMainDrawInsideTournamentUsecase;
