"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountService = void 0;
const prisma_1 = require("../config/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
exports.accountService = {
    async create(workspaceId, data) {
        const account = await prisma_1.prisma.account.create({
            data: {
                workspaceId,
                name: data.name,
                type: data.type,
                description: data.description,
                bankName: data.bankName,
                initialBalance: data.initialBalance || 0,
                currentBalance: data.initialBalance || 0,
                color: data.color || '#3B82F6',
                icon: data.icon || 'Wallet',
            },
        });
        return account;
    },
    async findByWorkspace(workspaceId) {
        const accounts = await prisma_1.prisma.account.findMany({
            where: {
                workspaceId,
                isActive: true,
                archivedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
        return accounts;
    },
    async findById(accountId, workspaceId) {
        const account = await prisma_1.prisma.account.findFirst({
            where: {
                id: accountId,
                workspaceId,
            },
        });
        if (!account) {
            throw new errorHandler_1.AppError('Account not found', 404);
        }
        return account;
    },
    async update(accountId, workspaceId, data) {
        const account = await prisma_1.prisma.account.updateMany({
            where: {
                id: accountId,
                workspaceId,
            },
            data: {
                name: data.name,
                description: data.description,
                bankName: data.bankName,
                color: data.color,
                icon: data.icon,
            },
        });
        if (account.count === 0) {
            throw new errorHandler_1.AppError('Account not found', 404);
        }
        return this.findById(accountId, workspaceId);
    },
    async delete(accountId, workspaceId) {
        await prisma_1.prisma.account.updateMany({
            where: {
                id: accountId,
                workspaceId,
            },
            data: {
                isActive: false,
                archivedAt: new Date(),
            },
        });
        return { message: 'Account archived successfully' };
    },
    async getBalance(accountId, workspaceId) {
        const account = await this.findById(accountId, workspaceId);
        return {
            accountId: account.id,
            currentBalance: account.currentBalance,
            initialBalance: account.initialBalance,
        };
    },
};
//# sourceMappingURL=accountService.js.map