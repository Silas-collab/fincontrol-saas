"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const prisma_1 = require("../config/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
exports.transactionService = {
    async create(workspaceId, data) {
        const account = await prisma_1.prisma.account.findFirst({
            where: { id: data.accountId, workspaceId },
        });
        if (!account) {
            throw new errorHandler_1.AppError('Account not found', 404);
        }
        // Update account balance
        const balanceChange = data.type === 'INCOME' ? data.amount : -data.amount;
        await prisma_1.prisma.account.update({
            where: { id: data.accountId },
            data: { currentBalance: { increment: balanceChange } },
        });
        const transaction = await prisma_1.prisma.transaction.create({
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
    async findByWorkspace(workspaceId, query) {
        const page = query.page || 1;
        const limit = query.limit || 20;
        const skip = (page - 1) * limit;
        const where = { workspaceId };
        if (query.accountId)
            where.accountId = query.accountId;
        if (query.categoryId)
            where.categoryId = query.categoryId;
        if (query.type)
            where.type = query.type;
        if (query.startDate || query.endDate) {
            where.transactionDate = {};
            if (query.startDate)
                where.transactionDate.gte = query.startDate;
            if (query.endDate)
                where.transactionDate.lte = query.endDate;
        }
        const [transactions, total] = await Promise.all([
            prisma_1.prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                include: {
                    account: { select: { id: true, name: true, color: true } },
                    category: { select: { id: true, name: true, color: true, icon: true } },
                },
                orderBy: { transactionDate: 'desc' },
            }),
            prisma_1.prisma.transaction.count({ where }),
        ]);
        return { transactions, total, page, limit };
    },
    async findById(transactionId, workspaceId) {
        const transaction = await prisma_1.prisma.transaction.findFirst({
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
            throw new errorHandler_1.AppError('Transaction not found', 404);
        }
        return transaction;
    },
    async update(transactionId, workspaceId, data) {
        const existing = await this.findById(transactionId, workspaceId);
        // Revert old balance
        const oldBalanceChange = existing.type === 'INCOME' ? -existing.amount : existing.amount;
        await prisma_1.prisma.account.update({
            where: { id: existing.accountId },
            data: { currentBalance: { increment: oldBalanceChange } },
        });
        // Apply new balance
        const newType = data.type || existing.type;
        const newAmount = data.amount || existing.amount;
        const newAccountId = data.accountId || existing.accountId;
        const newBalanceChange = newType === 'INCOME' ? newAmount : -newAmount;
        await prisma_1.prisma.account.update({
            where: { id: newAccountId },
            data: { currentBalance: { increment: newBalanceChange } },
        });
        const transaction = await prisma_1.prisma.transaction.update({
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
    async delete(transactionId, workspaceId) {
        const transaction = await this.findById(transactionId, workspaceId);
        // Revert balance
        const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;
        await prisma_1.prisma.account.update({
            where: { id: transaction.accountId },
            data: { currentBalance: { increment: balanceChange } },
        });
        await prisma_1.prisma.transaction.delete({
            where: { id: transactionId },
        });
        return { message: 'Transaction deleted successfully' };
    },
    async getSummary(workspaceId, startDate, endDate) {
        const where = { workspaceId };
        if (startDate || endDate) {
            where.transactionDate = {};
            if (startDate)
                where.transactionDate.gte = startDate;
            if (endDate)
                where.transactionDate.lte = endDate;
        }
        const [income, expense] = await Promise.all([
            prisma_1.prisma.transaction.aggregate({
                where: { ...where, type: 'INCOME' },
                _sum: { amount: true },
            }),
            prisma_1.prisma.transaction.aggregate({
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
//# sourceMappingURL=transactionService.js.map