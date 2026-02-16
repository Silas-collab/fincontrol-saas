import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transactionService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const transactionController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const { accountId, categoryId, type, description, amount, transactionDate, notes, tags } = req.body;

      if (!accountId || !type || !description || !amount) {
        throw new AppError('Account, type, description and amount are required', 400);
      }

      const transaction = await transactionService.create(workspaceId, {
        accountId,
        categoryId,
        type,
        description,
        amount,
        transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
        notes,
        tags,
      });

      res.status(201).json({
        success: true,
        message: 'Transaction created successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const accountId = req.query.accountId as string;
      const categoryId = req.query.categoryId as string;
      const type = req.query.type as string;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const result = await transactionService.findByWorkspace(workspaceId, {
        page,
        limit,
        accountId,
        categoryId,
        type,
        startDate,
        endDate,
      });

      res.json({
        success: true,
        data: result.transactions,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;
      const { id } = req.params;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const transaction = await transactionService.findById(id, workspaceId);

      res.json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;
      const { id } = req.params;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const { accountId, categoryId, type, description, amount, transactionDate, notes, tags } = req.body;

      const transaction = await transactionService.update(id, workspaceId, {
        accountId,
        categoryId,
        type,
        description,
        amount,
        transactionDate: transactionDate ? new Date(transactionDate) : undefined,
        notes,
        tags,
      });

      res.json({
        success: true,
        message: 'Transaction updated successfully',
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;
      const { id } = req.params;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const result = await transactionService.delete(id, workspaceId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const summary = await transactionService.getSummary(workspaceId, startDate, endDate);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },
};
