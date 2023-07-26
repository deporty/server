"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditIntergroupMatchUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../../core/helpers");
const usecase_1 = require("../../../../core/usecase");
class EditIntergroupMatchUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, fileAdapter) {
        super();
        this.tournamentContract = tournamentContract;
        this.fileAdapter = fileAdapter;
    }
    call(param) {
        var _a, _b, _c, _d, _e;
        const prefixSignaturePath = `tournaments/${param.tournamentId}/stages/${param.stageId}/intergroups/matches/${(_a = param.intergroupMatch.match) === null || _a === void 0 ? void 0 : _a.teamA.id}-${(_b = param.intergroupMatch.match) === null || _b === void 0 ? void 0 : _b.teamB.id}`;
        const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
        const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
        const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;
        const signatures = [
            (0, helpers_1.convertToImage)((_c = param.intergroupMatch.match) === null || _c === void 0 ? void 0 : _c.captainASignature, captainASignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)((_d = param.intergroupMatch.match) === null || _d === void 0 ? void 0 : _d.captainBSignature, captainBSignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)((_e = param.intergroupMatch.match) === null || _e === void 0 ? void 0 : _e.judgeSignature, judgeSignaturePath, this.fileAdapter),
        ];
        return (0, rxjs_1.zip)(...signatures).pipe((0, operators_1.map)((data) => {
            if (param.intergroupMatch.match) {
                param.intergroupMatch.match.captainASignature = data[0];
                param.intergroupMatch.match.captainBSignature = data[1];
                param.intergroupMatch.match.judgeSignature = data[2];
            }
            return this.tournamentContract.editIntergroupMatch(param.tournamentId, param.stageId, param.intergroupMatch);
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.EditIntergroupMatchUsecase = EditIntergroupMatchUsecase;
