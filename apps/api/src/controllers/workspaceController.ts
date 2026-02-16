import { Request, Response, NextFunction } from 'express';
import { workspaceService } from '../services/workspaceService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const workspaceController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const { name, description, type, currency, timezone } = req.body;

      if (!name || !type) {
        throw new AppError('Name and type are required', 400);
      }

      const workspace = await workspaceService.create(userId, {
        name,
        description,
        type,
        currency,
        timezone,
      });

      res.status(201).json({
        success: true,
        message: 'Workspace created successfully',
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const workspaces = await workspaceService.findByUser(userId);

      res.json({
        success: true,
        data: workspaces,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const workspace = await workspaceService.findById(id, userId);

      res.json({
        success: true,
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const { name, description, currency, timezone } = req.body;

      const workspace = await workspaceService.update(id, userId, {
        name,
        description,
        currency,
        timezone,
      });

      res.json({
        success: true,
        message: 'Workspace updated successfully',
        data: workspace,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const result = await workspaceService.delete(id, userId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },

  async inviteMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const { email, role } = req.body;

      if (!email) {
        throw new AppError('Email is required', 400);
      }

      const member = await workspaceService.inviteMember(id, userId, email, role);

      res.json({
        success: true,
        message: 'Member invited successfully',
        data: member,
      });
    } catch (error) {
      next(error);
    }
  },

  async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { id, memberId } = req.params;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const result = await workspaceService.removeMember(id, userId, memberId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
