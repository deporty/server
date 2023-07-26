"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTournamentLayoutUsecase = exports.TournamentLayoutAlreadyExistsError = void 0;
const utilities_1 = require("@deporty/utilities");
const usecase_1 = require("../../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class TournamentLayoutAlreadyExistsError extends Error {
    constructor() {
        super();
        this.name = 'TournamentLayoutAlreadyExistsError';
        this.message = 'The tournament layout with the same name already exists';
    }
}
exports.TournamentLayoutAlreadyExistsError = TournamentLayoutAlreadyExistsError;
class CreateTournamentLayoutUsecase extends usecase_1.Usecase {
    constructor(tournamentLayoutContract, fileAdapter) {
        super();
        this.tournamentLayoutContract = tournamentLayoutContract;
        this.fileAdapter = fileAdapter;
    }
    call(tournamentLayout) {
        const prevFlayer = tournamentLayout.flayer;
        tournamentLayout.flayer = undefined;
        return this.tournamentLayoutContract
            .filter({
            organizationId: tournamentLayout.organizationId,
        }, {
            name: {
                operator: '==',
                value: tournamentLayout.name,
            },
        })
            .pipe((0, operators_1.mergeMap)((prevTournamentLayout) => {
            if (prevTournamentLayout.length > 0) {
                return (0, rxjs_1.throwError)(new TournamentLayoutAlreadyExistsError());
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
                        organizationId: tournamentLayout.organizationId,
                    }, tournamentLayout)
                        .pipe((0, operators_1.map)((id) => {
                        return Object.assign(Object.assign({}, tournamentLayout), { id });
                    }));
                }), (0, operators_1.mergeMap)((fullTournamentLayout) => {
                    const extension = (0, utilities_1.getImageExtension)(prevFlayer);
                    const path = `organizations/${tournamentLayout.organizationId}/tournament-layouts/${fullTournamentLayout.id}/flayer.${extension}`;
                    return this.fileAdapter.uploadFile(path, prevFlayer).pipe((0, operators_1.mergeMap)((mn) => {
                        const updatedTournamentLayout = Object.assign(Object.assign({}, fullTournamentLayout), { flayer: path });
                        return this.tournamentLayoutContract
                            .update({
                            organizationId: tournamentLayout.organizationId,
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
                    organizationId: tournamentLayout.organizationId,
                }, tournamentLayout)
                    .pipe((0, operators_1.map)((id) => {
                    return Object.assign(Object.assign({}, tournamentLayout), { id });
                }));
            }
        }));
    }
}
exports.CreateTournamentLayoutUsecase = CreateTournamentLayoutUsecase;
