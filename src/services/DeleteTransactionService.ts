import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<boolean> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    const affected = await transactionRepository.delete(transaction.id);

    if (!affected) {
      throw new AppError('Error delete transaction', 400);
    }

    return affected.affected ? affected.affected > 0 : false;
  }
}

export default DeleteTransactionService;
