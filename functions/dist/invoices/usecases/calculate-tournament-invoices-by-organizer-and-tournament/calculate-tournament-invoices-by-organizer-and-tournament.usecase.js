"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentInvoicesByOrganizerAndTournament = void 0;
const usecase_1 = require("../../../core/usecase");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class CalculateTournamentInvoicesByOrganizerAndTournament extends usecase_1.Usecase {
    constructor(getTournamentOverviewByIdUsecase) {
        super();
        this.getTournamentOverviewByIdUsecase = getTournamentOverviewByIdUsecase;
    }
    call(params) {
        return this.getTournamentOverviewByIdUsecase.call(params.tournamentId).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((tournament) => {
            return {
                tournament,
                invoices: [
                    {
                        subject: 'Pago torneo',
                        description: 'Paga un torneo de 48 equipos',
                        amount: 700000,
                        date: new Date(),
                        maxPaymentDate: new Date(),
                        status: 'pending',
                    },
                ],
            };
        }));
    }
}
exports.CalculateTournamentInvoicesByOrganizerAndTournament = CalculateTournamentInvoicesByOrganizerAndTournament;
