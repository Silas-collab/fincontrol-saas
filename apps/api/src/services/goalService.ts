import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

interface CreateGoalData {
  name: string;
  description?: string;
  type: string;
  targetAmount: number;
  targetDate?: Date;
  icon?: string;
  color?: string;
  autoAllocate?: boolean;
  allocationPercentage?: number;
}

export const goalService = {
  async create(workspaceId: string, data: CreateGoalData) {
    const goal = await prisma.goal.create({
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

  async findByWorkspace(workspaceId: string) {
    const goals = await prisma.goal.findMany({
      where: {
        workspaceId,
        status: 'ACTIVE',
      },
      orderBy: { createdAt: 'desc' },
    });

    return goals;
  },

  async findById(goalId: string, workspaceId: string) {
    const goal = await prisma.goal.findFirst({
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
      throw new AppError('Goal not found', 404);
    }

    return goal;
  },

  async update(goalId: string, workspaceId: string, data: Partial<CreateGoalData>) {
    const goal = await prisma.goal.updateMany({
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
      throw new AppError('Goal not found', 404);
    }

    return this.findById(goalId, workspaceId);
  },

  async delete(goalId: string, workspaceId: string) {
    await prisma.goal.updateMany({
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

  async addContribution(goalId: string, workspaceId: string, amount: number, description?: string) {
    const goal = await this.findById(goalId, workspaceId);

    const contribution = await prisma.goalContribution.create({
      data: {
        goalId,
        amount,
        description,
      },
    });

    await prisma.goal.update({
      where: { id: goalId },
      data: {
        currentAmount: { increment: amount },
      },
    });

    return contribution;
  },
};
