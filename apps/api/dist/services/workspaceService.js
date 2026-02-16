"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceService = void 0;
const prisma_1 = require("../config/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
exports.workspaceService = {
    async create(userId, data) {
        const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36);
        const workspace = await prisma_1.prisma.workspace.create({
            data: {
                name: data.name,
                slug,
                description: data.description,
                type: data.type,
                currency: data.currency || 'BRL',
                timezone: data.timezone || 'America/Sao_Paulo',
            },
        });
        await prisma_1.prisma.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                userId,
                role: 'owner',
            },
        });
        // Create default categories
        const defaultCategories = [
            { name: 'Food & Dining', type: 'EXPENSE', color: '#EF4444', icon: 'Utensils' },
            { name: 'Transportation', type: 'EXPENSE', color: '#F59E0B', icon: 'Car' },
            { name: 'Shopping', type: 'EXPENSE', color: '#8B5CF6', icon: 'ShoppingBag' },
            { name: 'Entertainment', type: 'EXPENSE', color: '#EC4899', icon: 'Film' },
            { name: 'Healthcare', type: 'EXPENSE', color: '#10B981', icon: 'Heart' },
            { name: 'Salary', type: 'INCOME', color: '#22C55E', icon: 'Briefcase' },
            { name: 'Freelance', type: 'INCOME', color: '#3B82F6', icon: 'Laptop' },
            { name: 'Investments', type: 'INCOME', color: '#06B6D4', icon: 'TrendingUp' },
        ];
        for (const cat of defaultCategories) {
            await prisma_1.prisma.category.create({
                data: {
                    workspaceId: workspace.id,
                    name: cat.name,
                    type: cat.type,
                    color: cat.color,
                    icon: cat.icon,
                    keywords: cat.name.toLowerCase(),
                },
            });
        }
        return workspace;
    },
    async findById(workspaceId, userId) {
        const member = await prisma_1.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
            },
            include: {
                workspace: {
                    include: {
                        members: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true,
                                        email: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!member) {
            throw new errorHandler_1.AppError('Workspace not found or access denied', 404);
        }
        return member.workspace;
    },
    async findByUser(userId) {
        const memberships = await prisma_1.prisma.workspaceMember.findMany({
            where: { userId },
            include: {
                workspace: true,
            },
            orderBy: { joinedAt: 'desc' },
        });
        return memberships.map(m => ({
            ...m.workspace,
            role: m.role,
        }));
    },
    async update(workspaceId, userId, data) {
        const member = await prisma_1.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
                role: { in: ['owner', 'admin'] },
            },
        });
        if (!member) {
            throw new errorHandler_1.AppError('Access denied', 403);
        }
        const workspace = await prisma_1.prisma.workspace.update({
            where: { id: workspaceId },
            data: {
                name: data.name,
                description: data.description,
                currency: data.currency,
                timezone: data.timezone,
            },
        });
        return workspace;
    },
    async delete(workspaceId, userId) {
        const member = await prisma_1.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
                role: 'owner',
            },
        });
        if (!member) {
            throw new errorHandler_1.AppError('Only owner can delete workspace', 403);
        }
        await prisma_1.prisma.workspace.delete({
            where: { id: workspaceId },
        });
        return { message: 'Workspace deleted successfully' };
    },
    async inviteMember(workspaceId, userId, email, role) {
        const inviter = await prisma_1.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
                role: { in: ['owner', 'admin'] },
            },
        });
        if (!inviter) {
            throw new errorHandler_1.AppError('Access denied', 403);
        }
        const invitedUser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!invitedUser) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const existingMember = await prisma_1.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId: invitedUser.id,
            },
        });
        if (existingMember) {
            throw new errorHandler_1.AppError('User is already a member', 409);
        }
        const member = await prisma_1.prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId: invitedUser.id,
                role: role || 'member',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });
        return member;
    },
    async removeMember(workspaceId, userId, memberUserId) {
        const requester = await prisma_1.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
                role: { in: ['owner', 'admin'] },
            },
        });
        if (!requester) {
            throw new errorHandler_1.AppError('Access denied', 403);
        }
        await prisma_1.prisma.workspaceMember.deleteMany({
            where: {
                workspaceId,
                userId: memberUserId,
            },
        });
        return { message: 'Member removed successfully' };
    },
};
//# sourceMappingURL=workspaceService.js.map