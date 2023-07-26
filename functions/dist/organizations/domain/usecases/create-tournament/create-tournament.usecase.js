"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTournamentUsecase = exports.TournamentAlreadyExistsError = void 0;
const utilities_1 = require("@deporty/utilities");
const usecase_1 = require("../../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class TournamentAlreadyExistsError extends Error {
    constructor() {
        super();
        this.name = 'TournamentAlreadyExistsError';
        this.message = 'The tournament with the given properties already exists';
    }
}
exports.TournamentAlreadyExistsError = TournamentAlreadyExistsError;
class CreateTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentLayoutContract, fileAdapter) {
        super();
        this.tournamentLayoutContract = tournamentLayoutContract;
        this.fileAdapter = fileAdapter;
    }
    call(tournament) {
        const prevFlayer = tournament.flayer;
        tournament.flayer = undefined;
        return this.tournamentLayoutContract
            .filter({
            category: {
                operator: '==',
                value: tournament.category,
            },
            edition: {
                operator: '==',
                value: tournament.edition,
            },
            organizationId: {
                operator: '==',
                value: tournament.organizationId,
            },
            tournamentLayoutId: {
                operator: '==',
                value: tournament.tournamentLayoutId,
            },
            version: {
                operator: '==',
                value: tournament.version,
            },
        })
            .pipe((0, operators_1.mergeMap)((prevTournamentLayout) => {
            if (prevTournamentLayout.length > 0) {
                return (0, rxjs_1.throwError)(new TournamentAlreadyExistsError());
            }
            if (!!prevFlayer) {
                const validations = {
                    maxWidth: 400,
                    maxHeight: 400,
                    mustBeTransparent: false,
                    maxAspectRatio: 1.3,
                };
                const isValid = (0, rxjs_1.from)((0, utilities_1.validateImage)(prevFlayer, validations));
                return isValid.pipe((0, operators_1.mergeMap)(() => {
                    return this.tournamentLayoutContract
                        .save({
                        organizationId: tournament.organizationId,
                    }, tournament)
                        .pipe((0, operators_1.map)((id) => {
                        return Object.assign(Object.assign({}, tournament), { id });
                    }));
                }), (0, operators_1.mergeMap)((fullTournamentLayout) => {
                    const extension = (0, utilities_1.getImageExtension)(prevFlayer);
                    const path = `organizations/${tournament.organizationId}/tournament-layouts/${fullTournamentLayout.id}/flayer.${extension}`;
                    return this.fileAdapter.uploadFile(path, prevFlayer).pipe((0, operators_1.mergeMap)((mn) => {
                        const updatedTournamentLayout = Object.assign(Object.assign({}, fullTournamentLayout), { flayer: path });
                        return this.tournamentLayoutContract
                            .update({
                            organizationId: tournament.organizationId,
                            tournamentLayoutId: fullTournamentLayout.id,
                        }, updatedTournamentLayout)
                            .pipe((0, operators_1.map)((x) => {
                            return updatedTournamentLayout;
                        }));
                    }));
                }));
            }
            else {
                return this.tournamentLayoutContract
                    .save({
                    organizationId: tournament.organizationId,
                }, tournament)
                    .pipe((0, operators_1.map)((id) => {
                    return Object.assign(Object.assign({}, tournament), { id });
                }));
            }
        }));
    }
}
exports.CreateTournamentUsecase = CreateTournamentUsecase;
