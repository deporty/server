"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculateTournamentInvoices = void 0;
const moment = require("moment");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const usecase_1 = require("../../../core/usecase");
class CalculateTournamentInvoices extends usecase_1.Usecase {
    constructor(updateTournamentUsecase) {
        super();
        this.updateTournamentUsecase = updateTournamentUsecase;
    }
    call(tournament) {
        return (0, rxjs_1.of)(tournament).pipe((0, operators_1.map)((tournament) => {
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
        }), (0, operators_1.map)((data) => {
            const tournament = Object.assign({}, data.tournament);
            tournament.financialStatements.invoices = data.invoices;
            return this.updateTournamentUsecase.call(data.tournament).pipe((0, operators_1.map)(() => {
                return {
                    tournament,
                    invoices: data.invoices,
                };
            }));
        }), (0, operators_1.mergeMap)((x) => x));
    }
}
exports.CalculateTournamentInvoices = CalculateTournamentInvoices;
