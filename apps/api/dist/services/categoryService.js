"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
const prisma_1 = require("../config/prisma");
const errorHandler_1 = require("../middleware/errorHandler");
exports.categoryService = {
    async create(workspaceId, data) {
        const category = await prisma_1.prisma.category.create({
            data: {
                workspaceId,
                name: data.name,
                type: data.type,
                parentId: data.parentId || null,
                color: data.color || '#6B7280',
                icon: data.icon || 'Tag',
                description: data.description,
                keywords: data.name.toLowerCase(),
            },
        });
        return category;
    },
    async findByWorkspace(workspaceId) {
        const categories = await prisma_1.prisma.category.findMany({
            where: {
                workspaceId,
                isActive: true,
            },
            include: {
                parent: true,
                children: true,
            },
            orderBy: { name: 'asc' },
        });
        return categories;
    },
    async findById(categoryId, workspaceId) {
        const category = await prisma_1.prisma.category.findFirst({
            where: {
                id: categoryId,
                workspaceId,
            },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) {
            throw new errorHandler_1.AppError('Category not found', 404);
        }
        return category;
    },
    async update(categoryId, workspaceId, data) {
        const category = await prisma_1.prisma.category.updateMany({
            where: {
                id: categoryId,
                workspaceId,
            },
            data: {
                name: data.name,
                color: data.color,
                icon: data.icon,
                description: data.description,
            },
        });
        if (category.count === 0) {
            throw new errorHandler_1.AppError('Category not found', 404);
        }
        return this.findById(categoryId, workspaceId);
    },
    async delete(categoryId, workspaceId) {
        const transactionsCount = await prisma_1.prisma.transaction.count({
            where: { categoryId },
        });
        if (transactionsCount > 0) {
            throw new errorHandler_1.AppError('Cannot delete category with transactions', 400);
        }
        await prisma_1.prisma.category.updateMany({
            where: {
                id: categoryId,
                workspaceId,
            },
            data: {
                isActive: false,
            },
        });
        return { message: 'Category deleted successfully' };
    },
};
//# sourceMappingURL=categoryService.js.map