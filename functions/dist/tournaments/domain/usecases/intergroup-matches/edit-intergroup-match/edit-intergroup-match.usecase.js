"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditIntergroupMatchUsecase = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../../../core/helpers");
const usecase_1 = require("../../../../../core/usecase");
class EditIntergroupMatchUsecase extends usecase_1.Usecase {
    constructor(intergroupMatchContract, fileAdapter) {
        super();
        this.intergroupMatchContract = intergroupMatchContract;
        this.fileAdapter = fileAdapter;
    }
    call(param) {
        const prefixSignaturePath = `tournaments/${param.tournamentId}/stages/${param.fixtureStageId}/intergroups/matches/${param.intergroupMatch.id}`;
        const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
        const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
        const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;
        const signatures = [
            (0, helpers_1.convertToImage)(param.intergroupMatch.match['captainASignature'], captainASignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)(param.intergroupMatch.match['captainBSignature'], captainBSignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)(param.intergroupMatch.match['judgeSignature'], judgeSignaturePath, this.fileAdapter),
        ];
        return (0, rxjs_1.zip)(...signatures).pipe((0, operators_1.mergeMap)((data) => {
            param.intergroupMatch.match.captainASignature = data[0];
            param.intergroupMatch.match.captainBSignature = data[1];
            param.intergroupMatch.match.judgeSignature = data[2];
            return this.intergroupMatchContract
                .update({
                fixtureStageId: param.fixtureStageId,
                tournamentId: param.tournamentId,
            }, param.intergroupMatch)
                .pipe((0, operators_1.map)((data) => {
                return param.intergroupMatch;
            }));
        }));
    }
}
exports.EditIntergroupMatchUsecase = EditIntergroupMatchUsecase;
