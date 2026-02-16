import { Request, Response, NextFunction } from 'express';
import { goalService } from '../services/goalService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const goalController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const { name, description, type, targetAmount, targetDate, icon, color, autoAllocate, allocationPercentage } = req.body;

      if (!name || !type || !targetAmount) {
        throw new AppError('Name, type and targetAmount are required', 400);
      }

      const goal = await goalService.create(workspaceId, {
        name,
        description,
        type,
        targetAmount,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        icon,
        color,
        autoAllocate,
        allocationPercentage,
      });

      res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: goal,
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

      const goals = await goalService.findByWorkspace(workspaceId);

      res.json({
        success: true,
        data: goals,
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

      const goal = await goalService.findById(id, workspaceId);

      res.json({
        success: true,
        data: goal,
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

      const { name, description, targetAmount, targetDate, icon, color, autoAllocate, allocationPercentage } = req.body;

      const goal = await goalService.update(id, workspaceId, {
        name,
        description,
        targetAmount,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        icon,
        color,
        autoAllocate,
        allocationPercentage,
      });

      res.json({
        success: true,
        message: 'Goal updated successfully',
        data: goal,
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

      const result = await goalService.delete(id, workspaceId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  async addContribution(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;
      const { id } = req.params;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const { amount, description } = req.body;

      if (!amount || amount <= 0) {
        throw new AppError('Amount must be greater than 0', 400);
      }

      const contribution = await goalService.addContribution(id, workspaceId, amount, description);

      res.status(201).json({
        success: true,
        message: 'Contribution added successfully',
        data: contribution,
      });
    } catch (error) {
      next(error);
    }
  },
};
