"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardService = void 0;
const prisma_1 = require("../config/prisma");
exports.dashboardService = {
    async getSummary(workspaceId) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const [totalAccounts, activeAccounts, totalBalance, monthlyIncome, monthlyExpense, totalTransactions, activeGoals, activeBudgets, recentTransactions,] = await Promise.all([
            prisma_1.prisma.account.count({ where: { workspaceId } }),
            prisma_1.prisma.account.count({ where: { workspaceId, isActive: true } }),
            prisma_1.prisma.account.aggregate({
                where: { workspaceId, isActive: true },
                _sum: { currentBalance: true },
            }),
            prisma_1.prisma.transaction.aggregate({
                where: {
                    workspaceId,
                    type: 'INCOME',
                    transactionDate: { gte: startOfMonth, lte: endOfMonth },
                },
                _sum: { amount: true },
            }),
            prisma_1.prisma.transaction.aggregate({
                where: {
                    workspaceId,
                    type: 'EXPENSE',
                    transactionDate: { gte: startOfMonth, lte: endOfMonth },
                },
                _sum: { amount: true },
            }),
            prisma_1.prisma.transaction.count({ where: { workspaceId } }),
            prisma_1.prisma.goal.count({ where: { workspaceId, status: 'ACTIVE' } }),
            prisma_1.prisma.budget.count({ where: { workspaceId, isActive: true } }),
            prisma_1.prisma.transaction.findMany({
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
    async getMonthlyTrend(workspaceId, months = 6) {
        const trends = [];
        const now = new Date();
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const [income, expense] = await Promise.all([
                prisma_1.prisma.transaction.aggregate({
                    where: {
                        workspaceId,
                        type: 'INCOME',
                        transactionDate: { gte: startOfMonth, lte: endOfMonth },
                    },
                    _sum: { amount: true },
                }),
                prisma_1.prisma.transaction.aggregate({
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
    async getCategoryBreakdown(workspaceId, type) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const categories = await prisma_1.prisma.transaction.groupBy({
            by: ['categoryId'],
            where: {
                workspaceId,
                type,
                transactionDate: { gte: startOfMonth },
            },
            _sum: { amount: true },
        });
        const categoryDetails = await Promise.all(categories.map(async (cat) => {
            if (!cat.categoryId)
                return null;
            const category = await prisma_1.prisma.category.findUnique({
                where: { id: cat.categoryId },
                select: { name: true, color: true, icon: true },
            });
            return {
                ...category,
                amount: cat._sum.amount || 0,
            };
        }));
        return categoryDetails.filter(Boolean);
    },
};
//# sourceMappingURL=dashboardService.js.map