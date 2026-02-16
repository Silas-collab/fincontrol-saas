import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

interface CreateTransactionData {
  accountId: string;
  categoryId?: string;
  type: string;
  description: string;
  amount: number;
  transactionDate: Date;
  notes?: string;
  tags?: string;
}

export const transactionService = {
  async create(workspaceId: string, data: CreateTransactionData) {
    const account = await prisma.account.findFirst({
      where: { id: data.accountId, workspaceId },
    });

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    // Update account balance
    const balanceChange = data.type === 'INCOME' ? data.amount : -data.amount;
    await prisma.account.update({
      where: { id: data.accountId },
      data: { currentBalance: { increment: balanceChange } },
    });

    const transaction = await prisma.transaction.create({
      data: {
        workspaceId,
        accountId: data.accountId,
        categoryId: data.categoryId,
        type: data.type,
        description: data.description,
        amount: data.amount,
        transactionDate: data.transactionDate,
        notes: data.notes,
        tags: data.tags || "",
        status: 'COMPLETED',
      },
      include: {
        account: true,
        category: true,
      },
    });

    return transaction;
  },

  async findByWorkspace(workspaceId: string, query: {
    page?: number;
    limit?: number;
    accountId?: string;
    categoryId?: string;
    type?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { workspaceId };
    if (query.accountId) where.accountId = query.accountId;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.type) where.type = query.type;
    if (query.startDate || query.endDate) {
      where.transactionDate = {};
      if (query.startDate) where.transactionDate.gte = query.startDate;
      if (query.endDate) where.transactionDate.lte = query.endDate;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: { select: { id: true, name: true, color: true } },
          category: { select: { id: true, name: true, color: true, icon: true } },
        },
        orderBy: { transactionDate: 'desc' },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, total, page, limit };
  },

  async findById(transactionId: string, workspaceId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        workspaceId,
      },
      include: {
        account: true,
        category: true,
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    return transaction;
  },

  async update(transactionId: string, workspaceId: string, data: Partial<CreateTransactionData>) {
    const existing = await this.findById(transactionId, workspaceId);

    // Revert old balance
    const oldBalanceChange = existing.type === 'INCOME' ? -existing.amount : existing.amount;
    await prisma.account.update({
      where: { id: existing.accountId },
      data: { currentBalance: { increment: oldBalanceChange } },
    });

    // Apply new balance
    const newType = data.type || existing.type;
    const newAmount = data.amount || existing.amount;
    const newAccountId = data.accountId || existing.accountId;
    const newBalanceChange = newType === 'INCOME' ? newAmount : -newAmount;

    await prisma.account.update({
      where: { id: newAccountId },
      data: { currentBalance: { increment: newBalanceChange } },
    });

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        accountId: data.accountId,
        categoryId: data.categoryId,
        type: data.type,
        description: data.description,
        amount: data.amount,
        transactionDate: data.transactionDate,
        notes: data.notes,
        tags: data.tags || "",
      },
      include: {
        account: true,
        category: true,
      },
    });

    return transaction;
  },

  async delete(transactionId: string, workspaceId: string) {
    const transaction = await this.findById(transactionId, workspaceId);

    // Revert balance
    const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { currentBalance: { increment: balanceChange } },
    });

    await prisma.transaction.delete({
      where: { id: transactionId },
    });

    return { message: 'Transaction deleted successfully' };
  },

  async getSummary(workspaceId: string, startDate?: Date, endDate?: Date) {
    const where: any = { workspaceId };
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate.gte = startDate;
      if (endDate) where.transactionDate.lte = endDate;
    }

    const [income, expense] = await Promise.all([
      prisma.transaction.aggregate({
        where: { ...where, type: 'INCOME' },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { ...where, type: 'EXPENSE' },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = income._sum.amount || 0;
    const totalExpense = expense._sum.amount || 0;

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  },
};
