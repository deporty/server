"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTournamentUsecase = exports.TournamentAlreadyExistsError = exports.OrganizationNotFoundError = exports.TournamentLayoutNotFoundError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const exceptions_1 = require("../../../../core/exceptions");
const usecase_1 = require("../../../../core/usecase");
const utilities_1 = require("@deporty/utilities");
class TournamentLayoutNotFoundError extends Error {
    constructor() {
        super(`The tournament layout was not found.`);
        this.name = 'TournamentLayoutNotFoundError';
    }
}
exports.TournamentLayoutNotFoundError = TournamentLayoutNotFoundError;
class OrganizationNotFoundError extends Error {
    constructor() {
        super(`The organization was not found.`);
        this.name = 'OrganizationNotFoundError';
    }
}
exports.OrganizationNotFoundError = OrganizationNotFoundError;
class TournamentAlreadyExistsError extends Error {
    constructor(properties) {
        super();
        this.name = 'TournamentAlreadyExistsError';
        this.message = `The tournament with these properties already exists: ${properties.join(', ')} `;
    }
}
exports.TournamentAlreadyExistsError = TournamentAlreadyExistsError;
class CreateTournamentUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, tournamentLayoutContract, getOrganizationByIdUsecase, fileAdapter) {
        super();
        this.tournamentContract = tournamentContract;
        this.tournamentLayoutContract = tournamentLayoutContract;
        this.getOrganizationByIdUsecase = getOrganizationByIdUsecase;
        this.fileAdapter = fileAdapter;
    }
    call(tournament) {
        const requiredAttributes = [
            'category',
            'organizationId',
            'tournamentLayoutId',
            'edition',
            'version',
        ];
        for (const att of requiredAttributes) {
            if (!tournament[att]) {
                return (0, rxjs_1.throwError)(new exceptions_1.EmptyAttributeError(att));
            }
        }
        return this.tournamentLayoutContract
            .getById({ organizationId: tournament.organizationId }, tournament.tournamentLayoutId)
            .pipe((0, operators_1.mergeMap)((tournamentLayout) => {
            if (!tournamentLayout) {
                return (0, rxjs_1.throwError)(new TournamentLayoutNotFoundError());
            }
            return (0, rxjs_1.of)(tournament);
        }), (0, operators_1.mergeMap)((tournament) => {
            return this.getOrganizationByIdUsecase
                .call(tournament.organizationId)
                .pipe((0, operators_1.mergeMap)((organization) => {
                if (!organization) {
                    return (0, rxjs_1.throwError)(new OrganizationNotFoundError());
                }
                return (0, rxjs_1.of)(organization);
            }), (0, operators_1.mergeMap)((data) => {
                const filters = {
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
                };
                return this.tournamentContract.filter(filters);
            }), (0, operators_1.mergeMap)((existingTournaments) => {
                if (existingTournaments.length > 0) {
                    return (0, rxjs_1.throwError)(new TournamentAlreadyExistsError([
                        'category',
                        'edition',
                        'organizationId',
                        'tournamentLayoutId',
                        'version',
                    ]));
                }
                if (!tournament.status) {
                    tournament.status = 'draft';
                }
                const prevFlayer = tournament.flayer;
                tournament.flayer = undefined;
                if (!!prevFlayer) {
                    const validations = {
                        maxWidth: 400,
                        maxHeight: 400,
                        mustBeTransparent: false,
                        maxAspectRatio: 1.3,
                    };
                    const isValid = (0, rxjs_1.from)((0, utilities_1.validateImage)(prevFlayer, validations));
                    return isValid.pipe((0, operators_1.mergeMap)(() => {
                        return this.tournamentContract.save(tournament).pipe((0, operators_1.map)((id) => {
                            return Object.assign(Object.assign({}, tournament), { id });
                        }));
                    }), (0, operators_1.mergeMap)((fullTournament) => {
                        const extension = (0, utilities_1.getImageExtension)(prevFlayer);
                        const path = `tournaments/${tournament.id}/flayer.${extension}`;
                        return this.fileAdapter
                            .uploadFile(path, prevFlayer)
                            .pipe((0, operators_1.mergeMap)((mn) => {
                            const updatedTournamentLayout = Object.assign(Object.assign({}, fullTournament), { flayer: path });
                            return this.tournamentContract
                                .update(updatedTournamentLayout.id, updatedTournamentLayout)
                                .pipe((0, operators_1.map)((x) => {
                                return updatedTournamentLayout;
                            }));
                        }));
                    }));
                }
                else {
                    return this.tournamentContract.save(tournament).pipe((0, operators_1.map)((id) => {
                        return Object.assign(Object.assign({}, tournament), { id });
                    }));
                }
            }));
        }));
    }
}
exports.CreateTournamentUsecase = CreateTournamentUsecase;
