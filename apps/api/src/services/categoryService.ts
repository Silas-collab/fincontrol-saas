import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

interface CreateCategoryData {
  name: string;
  type: string;
  parentId?: string;
  color?: string;
  icon?: string;
  description?: string;
}

export const categoryService = {
  async create(workspaceId: string, data: CreateCategoryData) {
    const category = await prisma.category.create({
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

  async findByWorkspace(workspaceId: string) {
    const categories = await prisma.category.findMany({
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

  async findById(categoryId: string, workspaceId: string) {
    const category = await prisma.category.findFirst({
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
      throw new AppError('Category not found', 404);
    }

    return category;
  },

  async update(categoryId: string, workspaceId: string, data: Partial<CreateCategoryData>) {
    const category = await prisma.category.updateMany({
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
      throw new AppError('Category not found', 404);
    }

    return this.findById(categoryId, workspaceId);
  },

  async delete(categoryId: string, workspaceId: string) {
    const transactionsCount = await prisma.transaction.count({
      where: { categoryId },
    });

    if (transactionsCount > 0) {
      throw new AppError('Cannot delete category with transactions', 400);
    }

    await prisma.category.updateMany({
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
