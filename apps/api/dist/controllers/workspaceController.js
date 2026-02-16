"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workspaceController = void 0;
const workspaceService_1 = require("../services/workspaceService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.workspaceController = {
    async create(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const { name, description, type, currency, timezone } = req.body;
            if (!name || !type) {
                throw new errorHandler_1.AppError('Name and type are required', 400);
            }
            const workspace = await workspaceService_1.workspaceService.create(userId, {
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
        }
        catch (error) {
            next(error);
        }
    },
    async getAll(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const workspaces = await workspaceService_1.workspaceService.findByUser(userId);
            res.json({
                success: true,
                data: workspaces,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getById(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const workspace = await workspaceService_1.workspaceService.findById(id, userId);
            res.json({
                success: true,
                data: workspace,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async update(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const { name, description, currency, timezone } = req.body;
            const workspace = await workspaceService_1.workspaceService.update(id, userId, {
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
        }
        catch (error) {
            next(error);
        }
    },
    async delete(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const result = await workspaceService_1.workspaceService.delete(id, userId);
            res.json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async inviteMember(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const { email, role } = req.body;
            if (!email) {
                throw new errorHandler_1.AppError('Email is required', 400);
            }
            const member = await workspaceService_1.workspaceService.inviteMember(id, userId, email, role);
            res.json({
                success: true,
                message: 'Member invited successfully',
                data: member,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async removeMember(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id, memberId } = req.params;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const result = await workspaceService_1.workspaceService.removeMember(id, userId, memberId);
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
//# sourceMappingURL=workspaceController.js.map