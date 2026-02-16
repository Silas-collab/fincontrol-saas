import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

interface CreateBudgetData {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  totalBudgeted: number;
  alertThreshold?: number;
  categories: { categoryId: string; budgeted: number }[];
}

export const budgetService = {
  async create(workspaceId: string, data: CreateBudgetData) {
    const budget = await prisma.budget.create({
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

  async findByWorkspace(workspaceId: string) {
    const budgets = await prisma.budget.findMany({
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

  async findById(budgetId: string, workspaceId: string) {
    const budget = await prisma.budget.findFirst({
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
      throw new AppError('Budget not found', 404);
    }

    return budget;
  },

  async update(budgetId: string, workspaceId: string, data: Partial<CreateBudgetData>) {
    const budget = await prisma.budget.updateMany({
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
      throw new AppError('Budget not found', 404);
    }

    return this.findById(budgetId, workspaceId);
  },

  async delete(budgetId: string, workspaceId: string) {
    await prisma.budget.updateMany({
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
