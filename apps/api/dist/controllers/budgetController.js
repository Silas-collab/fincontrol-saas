"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.budgetController = void 0;
const budgetService_1 = require("../services/budgetService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.budgetController = {
    async create(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const { name, description, startDate, endDate, totalBudgeted, alertThreshold, categories } = req.body;
            if (!name || !startDate || !endDate || !totalBudgeted) {
                throw new errorHandler_1.AppError('Name, startDate, endDate and totalBudgeted are required', 400);
            }
            const budget = await budgetService_1.budgetService.create(workspaceId, {
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
            const budgets = await budgetService_1.budgetService.findByWorkspace(workspaceId);
            res.json({
                success: true,
                data: budgets,
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
            const budget = await budgetService_1.budgetService.findById(id, workspaceId);
            res.json({
                success: true,
                data: budget,
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
            const { name, description, alertThreshold } = req.body;
            const budget = await budgetService_1.budgetService.update(id, workspaceId, {
                name,
                description,
                alertThreshold,
            });
            res.json({
                success: true,
                message: 'Budget updated successfully',
                data: budget,
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
            const result = await budgetService_1.budgetService.delete(id, workspaceId);
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
//# sourceMappingURL=budgetController.js.map