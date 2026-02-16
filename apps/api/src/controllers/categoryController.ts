import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';
import { AppError } from '../middleware/errorHandler';

interface AuthRequest extends Request {
  user?: any;
}

export const categoryController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.headers['x-workspace-id'] as string;

      if (!workspaceId) {
        throw new AppError('Workspace ID required', 400);
      }

      const { name, type, parentId, color, icon, description } = req.body;

      if (!name || !type) {
        throw new AppError('Name and type are required', 400);
      }

      const category = await categoryService.create(workspaceId, {
        name,
        type,
        parentId,
        color,
        icon,
        description,
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
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

      const categories = await categoryService.findByWorkspace(workspaceId);

      res.json({
        success: true,
        data: categories,
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

      const category = await categoryService.findById(id, workspaceId);

      res.json({
        success: true,
        data: category,
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

      const { name, color, icon, description } = req.body;

      const category = await categoryService.update(id, workspaceId, {
        name,
        color,
        icon,
        description,
      });

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: category,
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

      const result = await categoryService.delete(id, workspaceId);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  },
};
