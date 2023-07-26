"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentInvoicesById = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
const moment = require("moment");
class CalculateTournamentInvoicesById extends usecase_1.Usecase {
    constructor(getTournamentByIdUsecase) {
        super();
        this.getTournamentByIdUsecase = getTournamentByIdUsecase;
    }
    call(tournamentId) {
        return this.getTournamentByIdUsecase.call(tournamentId).pipe((0, operators_1.catchError)((error) => {
            return (0, rxjs_1.throwError)(error);
        }), (0, operators_1.map)((tournament) => {
            const invoices = tournament.financialStatements.invoices || [];
            const paidInvoices = invoices.filter((invoice) => {
                return invoice.status === 'paid';
            });
            const overdueInvoices = invoices.filter((invoice) => {
                return invoice.status === 'overdue';
            });
            const ammount = tournament.financialStatements.ammount;
            const availableAmountOfInvoices = tournament.financialStatements.numOfInvoices -
                paidInvoices.length -
                overdueInvoices.length;
            const amountToPaid = ammount -
                paidInvoices.reduce((acc, a) => {
                    return acc + a.amount;
                }, 0) +
                overdueInvoices.reduce((acc, a) => {
                    return acc + a.amount + (a.overdue || 0);
                }, 0);
            return {
                amountToPaid,
                availableAmountOfInvoices,
                tournament,
            };
        }), (0, operators_1.map)((data) => {
            const num = data.availableAmountOfInvoices;
            const cost = data.amountToPaid;
            const tournament = data.tournament;
            const invoices = [];
            const invoiceQuota = Math.round(cost / num);
            let date = moment(tournament.startsDate);
            let next = date.clone().add(1, 'M').add(-1, 'day');
            for (let i = 0; i < num; i++) {
                invoices.push({
                    subject: `Cuenta de cobro No. ${i + 1}`,
                    description: `Cuenta de cobro No. ${i + 1} de ${num}`,
                    amount: invoiceQuota,
                    date: date.toDate(),
                    maxPaymentDate: next.toDate(),
                    status: 'pending',
                });
                date = next.clone().add(1, 'day');
                next = date.clone().add(1, 'M').add(-1, 'day');
            }
            return {
                tournament,
                invoices: invoices,
            };
        }));
    }
}
exports.CalculateTournamentInvoicesById = CalculateTournamentInvoicesById;
