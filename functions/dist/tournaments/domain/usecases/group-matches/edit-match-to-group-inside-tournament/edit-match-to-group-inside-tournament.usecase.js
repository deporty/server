"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditMatchInsideGroupUsecase = exports.MatchIsCompletedError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const helpers_1 = require("../../../../../core/helpers");
const usecase_1 = require("../../../../../core/usecase");
const organizations_1 = require("@deporty-org/entities/organizations");
class MatchIsCompletedError extends Error {
    constructor() {
        super();
        this.message = `The Match is completed`;
        this.name = 'MatchIsCompletedError';
    }
}
exports.MatchIsCompletedError = MatchIsCompletedError;
class EditMatchInsideGroupUsecase extends usecase_1.Usecase {
    constructor(matchContract, fileAdapter, getMatchByIdUsecase, updatePositionTableUsecase, getGroupByIdUsecase, updateGroupUsecase, getTournamentByIdUsecase, organizationContract) {
        super();
        this.matchContract = matchContract;
        this.fileAdapter = fileAdapter;
        this.getMatchByIdUsecase = getMatchByIdUsecase;
        this.updatePositionTableUsecase = updatePositionTableUsecase;
        this.getGroupByIdUsecase = getGroupByIdUsecase;
        this.updateGroupUsecase = updateGroupUsecase;
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
        this.organizationContract = organizationContract;
    }
    call(param) {
        const $tournamentId = this.getTournamentByIdUsecase.call(param.tournamentId);
        const $match = this.getMatchByIdUsecase.call({
            fixtureStageId: param.fixtureStageId,
            groupId: param.groupId,
            matchId: param.match.id,
            tournamentId: param.tournamentId,
        });
        return (0, rxjs_1.zip)($match, $tournamentId).pipe((0, operators_1.mergeMap)(([prevMatch, tournament]) => {
            if (prevMatch.status !== 'completed') {
                const $tournamentLayout = this.organizationContract.getTournamentLayoutByIdUsecase(tournament.organizationId, tournament.tournamentLayoutId);
                const $group = this.getGroupByIdUsecase.call({
                    fixtureStageId: param.fixtureStageId,
                    groupId: param.groupId,
                    tournamentId: param.tournamentId,
                });
                return (0, rxjs_1.zip)(this.edit(param), $tournamentLayout, $group).pipe((0, operators_1.mergeMap)(([match, tournamentLayout, group]) => {
                    const config = tournamentLayout.fixtureStagesConfiguration || organizations_1.DEFAULT_FIXTURE_STAGES_CONFIGURATION;
                    return (0, rxjs_1.zip)((0, rxjs_1.of)(match), (0, rxjs_1.of)(group), match.status === 'completed' ? this.updatePositionTableUsecase.call({
                        availableTeams: group.teamIds,
                        match,
                        positionsTable: group.positionsTable,
                        tieBreakingOrder: config.tieBreakingOrder,
                        negativePointsPerCard: config.negativePointsPerCard,
                        pointsConfiguration: config.pointsConfiguration,
                        meta: {
                            tournamentId: param.tournamentId,
                            fixtureStageId: param.fixtureStageId,
                            groupId: param.groupId,
                        }
                    }) : (0, rxjs_1.of)(group.positionsTable));
                }), (0, operators_1.mergeMap)(([match, group, positionsTable]) => {
                    const newGroup = Object.assign(Object.assign({}, group), { positionsTable });
                    return (0, rxjs_1.zip)((0, rxjs_1.of)(match), (0, rxjs_1.of)(positionsTable), this.updateGroupUsecase.call({
                        fixtureStageId: param.fixtureStageId,
                        group: newGroup,
                        tournamentId: param.tournamentId,
                    }));
                }), (0, operators_1.map)(([match, positionsTable, group]) => {
                    return { match, positionsTable: positionsTable };
                }));
            }
            return (0, rxjs_1.throwError)(new MatchIsCompletedError());
        }));
    }
    edit(param) {
        const prefixSignaturePath = `tournaments/${param.tournamentId}/stages/${param.fixtureStageId}/groups/${param.groupId}/matches/${param.match.id}`;
        const captainASignaturePath = `${prefixSignaturePath}/captainASignature.jpg`;
        const captainBSignaturePath = `${prefixSignaturePath}/captainBSignature.jpg`;
        const judgeSignaturePath = `${prefixSignaturePath}/judgeSignature.jpg`;
        const signatures = [
            (0, helpers_1.convertToImage)(param.match['captainASignature'], captainASignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)(param.match['captainBSignature'], captainBSignaturePath, this.fileAdapter),
            (0, helpers_1.convertToImage)(param.match['judgeSignature'], judgeSignaturePath, this.fileAdapter),
        ];
        return (0, rxjs_1.zip)(...signatures).pipe((0, operators_1.mergeMap)((data) => {
            param.match.captainASignature = data[0];
            param.match.captainBSignature = data[1];
            param.match.judgeSignature = data[2];
            return this.matchContract
                .update({
                fixtureStageId: param.fixtureStageId,
                tournamentId: param.tournamentId,
                groupId: param.groupId,
                matchId: param.match.id,
            }, param.match)
                .pipe((0, operators_1.map)((data) => {
                return param.match;
            }));
        }));
    }
}
exports.EditMatchInsideGroupUsecase = EditMatchInsideGroupUsecase;
