import { Request, Response, NextFunction } from 'express';
import { budgetService } from '../services/budgetService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const budgetController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const { name, description, startDate, endDate, totalBudgeted, alertThreshold, categories } = req.body;

      if (!name || !startDate || !endDate || !totalBudgeted) {
        throw new AppError('Name, startDate, endDate and totalBudgeted are required', 400);
      }

      const budget = await budgetService.create(workspaceId, {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalBudgeted,
        alertThreshold,
        categories: categories || [],
      });

      res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: budget,
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

      const budgets = await budgetService.findByWorkspace(workspaceId);

      res.json({
        success: true,
        data: budgets,
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

      const budget = await budgetService.findById(id, workspaceId);

      res.json({
        success: true,
        data: budget,
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

      const { name, description, alertThreshold } = req.body;

      const budget = await budgetService.update(id, workspaceId, {
        name,
        description,
        alertThreshold,
      });

      res.json({
        success: true,
        message: 'Budget updated successfully',
        data: budget,
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

      const result = await budgetService.delete(id, workspaceId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
