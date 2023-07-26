"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTournamentsInvoiceByOrganizerUsecase = void 0;
const usecase_1 = require("../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class GetTournamentsInvoiceByOrganizerUsecase extends usecase_1.Usecase {
    constructor(getTournamentOverviewByIdUsecase) {
        super();
        this.getTournamentOverviewByIdUsecase = getTournamentOverviewByIdUsecase;
    }
    call(tournamentId) {
        return this.getTournamentOverviewByIdUsecase.call(tournamentId).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((tournament) => {
            return {
                tournament,
                subject: '',
                description: '',
                amount: 0,
                date: new Date(),
                maxPaymentDate: new Date(),
                status: 'pending',
            };
        }));
    }
}
exports.GetTournamentsInvoiceByOrganizerUsecase = GetTournamentsInvoiceByOrganizerUsecase;
