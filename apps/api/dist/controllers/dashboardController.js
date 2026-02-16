"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.dashboardController = {
    async getSummary(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const summary = await dashboardService_1.dashboardService.getSummary(workspaceId);
            res.json({
                success: true,
                data: summary,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getMonthlyTrend(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const months = parseInt(req.query.months) || 6;
            const trends = await dashboardService_1.dashboardService.getMonthlyTrend(workspaceId, months);
            res.json({
                success: true,
                data: trends,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getCategoryBreakdown(req, res, next) {
        try {
            const workspaceId = req.headers['x-workspace-id'];
            const type = req.query.type || 'EXPENSE';
            if (!workspaceId) {
                throw new errorHandler_1.AppError('Workspace ID required', 400);
            }
            const breakdown = await dashboardService_1.dashboardService.getCategoryBreakdown(workspaceId, type);
            res.json({
                success: true,
                data: breakdown,
            });
        }
        catch (error) {
            next(error);
        }
    },
};
//# sourceMappingURL=dashboardController.js.map