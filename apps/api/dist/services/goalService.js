"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalService = void 0;
const prisma_1 = require("../config/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
exports.goalService = {
    async create(workspaceId, data) {
        const goal = await prisma_1.prisma.goal.create({
            data: {
                workspaceId,
                name: data.name,
                description: data.description,
                type: data.type,
                targetAmount: data.targetAmount,
                targetDate: data.targetDate,
                startDate: new Date(),
                icon: data.icon || 'Target',
                color: data.color || '#10B981',
                autoAllocate: data.autoAllocate || false,
                allocationPercentage: data.allocationPercentage,
                status: 'ACTIVE',
            },
        });
        return goal;
    },
    async findByWorkspace(workspaceId) {
        const goals = await prisma_1.prisma.goal.findMany({
            where: {
                workspaceId,
                status: 'ACTIVE',
            },
            orderBy: { createdAt: 'desc' },
        });
        return goals;
    },
    async findById(goalId, workspaceId) {
        const goal = await prisma_1.prisma.goal.findFirst({
            where: {
                id: goalId,
                workspaceId,
            },
            include: {
                contributions: {
                    orderBy: { contributedAt: 'desc' },
                },
            },
        });
        if (!goal) {
            throw new errorHandler_1.AppError('Goal not found', 404);
        }
        return goal;
    },
    async update(goalId, workspaceId, data) {
        const goal = await prisma_1.prisma.goal.updateMany({
            where: {
                id: goalId,
                workspaceId,
            },
            data: {
                name: data.name,
                description: data.description,
                targetAmount: data.targetAmount,
                targetDate: data.targetDate,
                icon: data.icon,
                color: data.color,
                autoAllocate: data.autoAllocate,
                allocationPercentage: data.allocationPercentage,
            },
        });
        if (goal.count === 0) {
            throw new errorHandler_1.AppError('Goal not found', 404);
        }
        return this.findById(goalId, workspaceId);
    },
    async delete(goalId, workspaceId) {
        await prisma_1.prisma.goal.updateMany({
            where: {
                id: goalId,
                workspaceId,
            },
            data: {
                status: 'CANCELLED',
            },
        });
        return { message: 'Goal cancelled successfully' };
    },
    async addContribution(goalId, workspaceId, amount, description) {
        const goal = await this.findById(goalId, workspaceId);
        const contribution = await prisma_1.prisma.goalContribution.create({
            data: {
                goalId,
                amount,
                description,
            },
        });
        await prisma_1.prisma.goal.update({
            where: { id: goalId },
            data: {
                currentAmount: { increment: amount },
            },
        });
        return contribution;
    },
};
//# sourceMappingURL=goalService.js.map