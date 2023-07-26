"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialStatementsMapper = void 0;
class FinancialStatementsMapper {
    constructor() { }
    fromJson(obj) {
        return {
            ammount: obj['amount'],
            status: obj['status'],
            invoices: obj['invoices'],
            numOfInvoices: obj['num-of-invoices'],
        };
    }
    toJson(financialStatements) {
        return {
            amount: financialStatements.ammount,
            status: financialStatements.status,
            invoices: financialStatements.invoices,
            'num-of-invoices': financialStatements.numOfInvoices,
        };
    }
}
exports.FinancialStatementsMapper = FinancialStatementsMapper;
