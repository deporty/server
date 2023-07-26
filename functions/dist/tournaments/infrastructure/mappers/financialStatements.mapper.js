"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialStatementsMapper = void 0;
const mapper_1 = require("../../../core/mapper");
class FinancialStatementsMapper extends mapper_1.Mapper {
    constructor() {
        super();
        this.attributesMapper = {
            ammount: { name: 'amount' },
            status: { name: 'status' },
            numOfInvoices: { name: 'num-of-invoices' },
        };
    }
}
exports.FinancialStatementsMapper = FinancialStatementsMapper;
