import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

interface CreateWorkspaceData {
  name: string;
  description?: string;
  type: string;
  currency?: string;
  timezone?: string;
}

export const workspaceService = {
  async create(userId: string, data: CreateWorkspaceData) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString(36);

    const workspace = await prisma.workspace.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        type: data.type,
        currency: data.currency || 'BRL',
        timezone: data.timezone || 'America/Sao_Paulo',
      },
    });

    await prisma.workspaceMember.create({
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
      await prisma.category.create({
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

  async findById(workspaceId: string, userId: string) {
    const member = await prisma.workspaceMember.findFirst({
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
      throw new AppError('Workspace not found or access denied', 404);
    }

    return member.workspace;
  },

  async findByUser(userId: string) {
    const memberships = await prisma.workspaceMember.findMany({
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

  async update(workspaceId: string, userId: string, data: Partial<CreateWorkspaceData>) {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!member) {
      throw new AppError('Access denied', 403);
    }

    const workspace = await prisma.workspace.update({
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

  async delete(workspaceId: string, userId: string) {
    const member = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: 'owner',
      },
    });

    if (!member) {
      throw new AppError('Only owner can delete workspace', 403);
    }

    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    return { message: 'Workspace deleted successfully' };
  },

  async inviteMember(workspaceId: string, userId: string, email: string, role: string) {
    const inviter = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!inviter) {
      throw new AppError('Access denied', 403);
    }

    const invitedUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!invitedUser) {
      throw new AppError('User not found', 404);
    }

    const existingMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: invitedUser.id,
      },
    });

    if (existingMember) {
      throw new AppError('User is already a member', 409);
    }

    const member = await prisma.workspaceMember.create({
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

  async removeMember(workspaceId: string, userId: string, memberUserId: string) {
    const requester = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        role: { in: ['owner', 'admin'] },
      },
    });

    if (!requester) {
      throw new AppError('Access denied', 403);
    }

    await prisma.workspaceMember.deleteMany({
      where: {
        workspaceId,
        userId: memberUserId,
      },
    });

    return { message: 'Member removed successfully' };
  },
};
