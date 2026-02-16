"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetService = void 0;
const prisma_1 = require("../config/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
exports.budgetService = {
    async create(workspaceId, data) {
        const budget = await prisma_1.prisma.budget.create({
            data: {
                workspaceId,
                name: data.name,
                description: data.description,
                startDate: data.startDate,
                endDate: data.endDate,
                totalBudgeted: data.totalBudgeted,
                alertThreshold: data.alertThreshold || 80,
                categories: {
                    create: data.categories.map(cat => ({
                        categoryId: cat.categoryId,
                        budgeted: cat.budgeted,
                        spent: 0,
                    })),
                },
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        return budget;
    },
    async findByWorkspace(workspaceId) {
        const budgets = await prisma_1.prisma.budget.findMany({
            where: {
                workspaceId,
                isActive: true,
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return budgets;
    },
    async findById(budgetId, workspaceId) {
        const budget = await prisma_1.prisma.budget.findFirst({
            where: {
                id: budgetId,
                workspaceId,
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
        if (!budget) {
            throw new errorHandler_1.AppError('Budget not found', 404);
        }
        return budget;
    },
    async update(budgetId, workspaceId, data) {
        const budget = await prisma_1.prisma.budget.updateMany({
            where: {
                id: budgetId,
                workspaceId,
            },
            data: {
                name: data.name,
                description: data.description,
                alertThreshold: data.alertThreshold,
            },
        });
        if (budget.count === 0) {
            throw new errorHandler_1.AppError('Budget not found', 404);
        }
        return this.findById(budgetId, workspaceId);
    },
    async delete(budgetId, workspaceId) {
        await prisma_1.prisma.budget.updateMany({
            where: {
                id: budgetId,
                workspaceId,
            },
            data: {
                isActive: false,
            },
        });
        return { message: 'Budget deleted successfully' };
    },
};
//# sourceMappingURL=budgetService.js.map