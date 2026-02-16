import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboardService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const dashboardController = {
  async getSummary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const summary = await dashboardService.getSummary(workspaceId);

      res.json({
        success: true,
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMonthlyTrend(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const months = parseInt(req.query.months as string) || 6;
      const trends = await dashboardService.getMonthlyTrend(workspaceId, months);

      res.json({
        success: true,
        data: trends,
      });
    } catch (error) {
      next(error);
    }
  },

  async getCategoryBreakdown(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;
      const type = req.query.type as string || 'EXPENSE';

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const breakdown = await dashboardService.getCategoryBreakdown(workspaceId, type);

      res.json({
        success: true,
        data: breakdown,
      });
    } catch (error) {
      next(error);
    }
  },
};
