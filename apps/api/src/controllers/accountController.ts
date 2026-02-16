import { Request, Response, NextFunction } from 'express';
import { accountService } from '../services/accountService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
  workspace?: any;
}

export const accountController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const { name, type, description, bankName, initialBalance, color, icon } = req.body;

      if (!name || !type) {
        throw new AppError('Name and type are required', 400);
      }

      const account = await accountService.create(workspaceId, {
        name,
        type,
        description,
        bankName,
        initialBalance,
        color,
        icon,
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: account,
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

      const accounts = await accountService.findByWorkspace(workspaceId);

      res.json({
        success: true,
        data: accounts,
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

      const account = await accountService.findById(id, workspaceId);

      res.json({
        success: true,
        data: account,
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

      const { name, description, bankName, color, icon } = req.body;

      const account = await accountService.update(id, workspaceId, {
        name,
        description,
        bankName,
        color,
        icon,
      });

      res.json({
        success: true,
        message: 'Account updated successfully',
        data: account,
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

      const result = await accountService.delete(id, workspaceId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
