"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goalController = void 0;
const goalService_1 = require("../services/goalService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.goalController = {
    async create(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const { name, description, type, targetAmount, targetDate, icon, color, autoAllocate, allocationPercentage } = req.body;
            if (!name || !type || !targetAmount) {
                throw new errorHandler_1.AppError('Name, type and targetAmount are required', 400);
            }
            const goal = await goalService_1.goalService.create(workspaceId, {
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
            const goals = await goalService_1.goalService.findByWorkspace(workspaceId);
            res.json({
                success: true,
                data: goals,
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
            const goal = await goalService_1.goalService.findById(id, workspaceId);
            res.json({
                success: true,
                data: goal,
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
            const { name, description, targetAmount, targetDate, icon, color, autoAllocate, allocationPercentage } = req.body;
            const goal = await goalService_1.goalService.update(id, workspaceId, {
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
            const result = await goalService_1.goalService.delete(id, workspaceId);
            res.json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async addContribution(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            const { id } = req.params;
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const { amount, description } = req.body;
            if (!amount || amount <= 0) {
                throw new errorHandler_1.AppError('Amount must be greater than 0', 400);
            }
            const contribution = await goalService_1.goalService.addContribution(id, workspaceId, amount, description);
            res.status(201).json({
                success: true,
                message: 'Contribution added successfully',
                data: contribution,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=goalController.js.map