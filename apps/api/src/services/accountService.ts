import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

interface CreateAccountData {
  name: string;
  type: string;
  description?: string;
  bankName?: string;
  initialBalance?: number;
  color?: string;
  icon?: string;
}

export const accountService = {
  async create(workspaceId: string, data: CreateAccountData) {
    const account = await prisma.account.create({
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

  async findByWorkspace(workspaceId: string) {
    const accounts = await prisma.account.findMany({
      where: {
        workspaceId,
        isActive: true,
        archivedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return accounts;
  },

  async findById(accountId: string, workspaceId: string) {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        workspaceId,
      },
    });

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    return account;
  },

  async update(accountId: string, workspaceId: string, data: Partial<CreateAccountData>) {
    const account = await prisma.account.updateMany({
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
      throw new AppError('Account not found', 404);
    }

    return this.findById(accountId, workspaceId);
  },

  async delete(accountId: string, workspaceId: string) {
    await prisma.account.updateMany({
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

  async getBalance(accountId: string, workspaceId: string) {
    const account = await this.findById(accountId, workspaceId);
    return {
      accountId: account.id,
      currentBalance: account.currentBalance,
      initialBalance: account.initialBalance,
    };
  },
};
