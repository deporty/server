import { FinancialStatementsModel } from '@deporty-org/entities';
import { Mapper } from '@scifamek-open-source/iraca/infrastructure';

export class FinancialStatementsMapper extends Mapper<FinancialStatementsModel> {
  constructor() {
    super();
    this.attributesMapper = {
      ammount: { name: 'amount' },
      status: { name: 'status' },
      numOfInvoices: { name: 'num-of-invoices' },
    };
  }
}
