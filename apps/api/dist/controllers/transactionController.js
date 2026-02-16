"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionController = void 0;
const transactionService_1 = require("../services/transactionService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.transactionController = {
    async create(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const { accountId, categoryId, type, description, amount, transactionDate, notes, tags } = req.body;
            if (!accountId || !type || !description || !amount) {
                throw new errorHandler_1.AppError('Account, type, description and amount are required', 400);
            }
            const transaction = await transactionService_1.transactionService.create(workspaceId, {
                accountId,
                categoryId,
                type,
                description,
                amount,
                transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
                notes,
                tags,
            });
            res.status(201).json({
                success: true,
                message: 'Transaction created successfully',
                data: transaction,
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
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 20;
            const accountId = req.query.accountId;
            const categoryId = req.query.categoryId;
            const type = req.query.type;
            const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
            const result = await transactionService_1.transactionService.findByWorkspace(workspaceId, {
                page,
                limit,
                accountId,
                categoryId,
                type,
                startDate,
                endDate,
            });
            res.json({
                success: true,
                data: result.transactions,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / limit),
                },
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
            const transaction = await transactionService_1.transactionService.findById(id, workspaceId);
            res.json({
                success: true,
                data: transaction,
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
            const { accountId, categoryId, type, description, amount, transactionDate, notes, tags } = req.body;
            const transaction = await transactionService_1.transactionService.update(id, workspaceId, {
                accountId,
                categoryId,
                type,
                description,
                amount,
                transactionDate: transactionDate ? new Date(transactionDate) : undefined,
                notes,
                tags,
            });
            res.json({
                success: true,
                message: 'Transaction updated successfully',
                data: transaction,
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
            const result = await transactionService_1.transactionService.delete(id, workspaceId);
            res.json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getSummary(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
            const summary = await transactionService_1.transactionService.getSummary(workspaceId, startDate, endDate);
            res.json({
                success: true,
                data: summary,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=transactionController.js.map