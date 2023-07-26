"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMatchesByDateUsecase = void 0;
const usecase_1 = require("../../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class GetAllMatchesByDateUsecase extends usecase_1.Usecase {
    constructor(tournamentContract, getAllGroupMatchesByTournamentUsecase) {
        super();
        this.tournamentContract = tournamentContract;
        this.getAllGroupMatchesByTournamentUsecase = getAllGroupMatchesByTournamentUsecase;
    }
    call(date) {
        const transformedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        const filters = {
            status: {
                operator: 'in',
                value: ['running'],
            },
        };
        return this.tournamentContract.filter(filters).pipe((0, operators_1.mergeMap)((tournaments) => {
            const response = [];
            for (const tournament of tournaments) {
                const $matches = this.getAllGroupMatchesByTournamentUsecase
                    .call({
                    tournamentId: tournament.id,
                    status: ['published'],
                })
                    .pipe((0, operators_1.map)((matches) => {
                    return {
                        matches: matches
                            .filter((m) => {
                            if (!m.date) {
                                return false;
                            }
                            const matchDate = m.date.getFullYear() +
                                '-' +
                                (m.date.getMonth() + 1) +
                                '-' +
                                m.date.getDate();
                            return transformedDate == matchDate;
                        })
                            .map((match) => {
                            return {
                                match,
                                meta: {
                                    phase: 'groups',
                                },
                            };
                        }),
                        tournament,
                    };
                }));
                response.push($matches);
            }
            if (response.length > 0) {
                return (0, rxjs_1.zip)(...response);
            }
            return (0, rxjs_1.of)([]);
        }), (0, operators_1.map)((tournaments) => {
            return tournaments.reduce((acc, curr) => {
                acc[curr.tournament.id] = curr;
                return acc;
            }, {});
        }));
    }
}
exports.GetAllMatchesByDateUsecase = GetAllMatchesByDateUsecase;
