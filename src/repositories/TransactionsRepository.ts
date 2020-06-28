import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = this.calculate(transactions, 'income');
    const outcome = this.calculate(transactions, 'outcome');

    const total = income - outcome;

    return { income, outcome, total };
  }

  private calculate(transactions: Transaction[], type: string): number {
    const calculated = transactions
      .filter(item => item.type === type)
      .map(item => item.value)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return calculated;
  }
}

export default TransactionsRepository;
