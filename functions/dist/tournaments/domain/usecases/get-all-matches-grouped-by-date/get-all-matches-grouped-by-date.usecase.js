"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllMatchesGroupedByDateUsecase = void 0;
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../../core/usecase");
const moment = require('moment');
const defaultFormat = 'dddd D MMM YYYY';
class GetAllMatchesGroupedByDateUsecase extends usecase_1.Usecase {
    constructor(getAllGroupMatchesByTournamentUsecase) {
        super();
        this.getAllGroupMatchesByTournamentUsecase = getAllGroupMatchesByTournamentUsecase;
    }
    call(tournamentId) {
        return this.getAllGroupMatchesByTournamentUsecase
            .call({ tournamentId, status: ['completed', 'in-review', 'published'] })
            .pipe((0, operators_1.map)((matches) => {
            return matches.filter((m) => {
                return !!m.date;
            });
        }), (0, operators_1.map)((matches) => {
            return matches.reduce((prev, curr) => {
                const date = moment(curr.date).format(defaultFormat);
                if (!prev[date]) {
                    prev[date] = [];
                }
                prev[date].push(curr);
                return prev;
            }, {});
        }));
    }
}
exports.GetAllMatchesGroupedByDateUsecase = GetAllMatchesGroupedByDateUsecase;
