import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid!', 403);
    }

    if (type === 'outcome' && total < value) {
      throw new AppError(`You don't have enough funds.`);
    }

    let cat = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!cat) {
      cat = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(cat);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: cat.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
