"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountController = void 0;
const accountService_1 = require("../services/accountService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.accountController = {
    async create(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const { name, type, description, bankName, initialBalance, color, icon } = req.body;
            if (!name || !type) {
                throw new errorHandler_1.AppError('Name and type are required', 400);
            }
            const account = await accountService_1.accountService.create(workspaceId, {
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
            const accounts = await accountService_1.accountService.findByWorkspace(workspaceId);
            res.json({
                success: true,
                data: accounts,
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
            const account = await accountService_1.accountService.findById(id, workspaceId);
            res.json({
                success: true,
                data: account,
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
            const { name, description, bankName, color, icon } = req.body;
            const account = await accountService_1.accountService.update(id, workspaceId, {
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
            const result = await accountService_1.accountService.delete(id, workspaceId);
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
//# sourceMappingURL=accountController.js.map