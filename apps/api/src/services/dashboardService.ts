import { prisma } from '../config/prisma';

export const dashboardService = {
  async getSummary(workspaceId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      totalAccounts,
      activeAccounts,
      totalBalance,
      monthlyIncome,
      monthlyExpense,
      totalTransactions,
      activeGoals,
      activeBudgets,
      recentTransactions,
    ] = await Promise.all([
      prisma.account.count({ where: { workspaceId } }),
      prisma.account.count({ where: { workspaceId, isActive: true } }),
      prisma.account.aggregate({
        where: { workspaceId, isActive: true },
        _sum: { currentBalance: true },
      }),
      prisma.transaction.aggregate({
        where: {
          workspaceId,
          type: 'INCOME',
          transactionDate: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: {
          workspaceId,
          type: 'EXPENSE',
          transactionDate: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.transaction.count({ where: { workspaceId } }),
      prisma.goal.count({ where: { workspaceId, status: 'ACTIVE' } }),
      prisma.budget.count({ where: { workspaceId, isActive: true } }),
      prisma.transaction.findMany({
        where: { workspaceId },
        take: 5,
        orderBy: { transactionDate: 'desc' },
        include: {
          account: { select: { name: true, color: true } },
          category: { select: { name: true, color: true, icon: true } },
        },
      }),
    ]);

    return {
      accounts: {
        total: totalAccounts,
        active: activeAccounts,
        totalBalance: totalBalance._sum.currentBalance || 0,
      },
      monthly: {
        income: monthlyIncome._sum.amount || 0,
        expense: monthlyExpense._sum.amount || 0,
        balance: (monthlyIncome._sum.amount || 0) - (monthlyExpense._sum.amount || 0),
      },
      transactions: {
        total: totalTransactions,
        recent: recentTransactions,
      },
      goals: {
        active: activeGoals,
      },
      budgets: {
        active: activeBudgets,
      },
    };
  },

  async getMonthlyTrend(workspaceId: string, months: number = 6) {
    const trends = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const [income, expense] = await Promise.all([
        prisma.transaction.aggregate({
          where: {
            workspaceId,
            type: 'INCOME',
            transactionDate: { gte: startOfMonth, lte: endOfMonth },
          },
          _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
          where: {
            workspaceId,
            type: 'EXPENSE',
            transactionDate: { gte: startOfMonth, lte: endOfMonth },
          },
          _sum: { amount: true },
        }),
      ]);

      trends.push({
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        income: income._sum.amount || 0,
        expense: expense._sum.amount || 0,
        balance: (income._sum.amount || 0) - (expense._sum.amount || 0),
      });
    }

    return trends;
  },

  async getCategoryBreakdown(workspaceId: string, type: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const categories = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        workspaceId,
        type,
        transactionDate: { gte: startOfMonth },
      },
      _sum: { amount: true },
    });

    const categoryDetails = await Promise.all(
      categories.map(async (cat) => {
        if (!cat.categoryId) return null;
        const category = await prisma.category.findUnique({
          where: { id: cat.categoryId },
          select: { name: true, color: true, icon: true },
        });
        return {
          ...category,
          amount: cat._sum.amount || 0,
        };
      })
    );

    return categoryDetails.filter(Boolean);
  },
};
