"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryController = void 0;
const categoryService_1 = require("../services/categoryService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.categoryController = {
    async create(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const { name, type, parentId, color, icon, description } = req.body;
            if (!name || !type) {
                throw new errorHandler_1.AppError('Name and type are required', 400);
            }
            const category = await categoryService_1.categoryService.create(workspaceId, {
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
        }
        catch (error) {
            next(error);
        }
    },
    async getAll(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const categories = await categoryService_1.categoryService.findByWorkspace(workspaceId);
            res.json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            const { id } = req.params;
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const category = await categoryService_1.categoryService.findById(id, workspaceId);
            res.json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            const { id } = req.params;
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const { name, color, icon, description } = req.body;
            const category = await categoryService_1.categoryService.update(id, workspaceId, {
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
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            const { id } = req.params;
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const result = await categoryService_1.categoryService.delete(id, workspaceId);
            res.json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=categoryController.js.map