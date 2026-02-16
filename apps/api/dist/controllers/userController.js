"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userService_1 = require("../services/userService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.userController = {
    async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await userService_1.userService.findAll({ page, limit, search });
            res.json({
                success: true,
                data: result.users,
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
            const { id } = req.params;
            const user = await userService_1.userService.findById(id);
            res.json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async updateAvatar(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const { avatarUrl } = req.body;
            if (!avatarUrl) {
                throw new errorHandler_1.AppError('Avatar URL required', 400);
            }
            const user = await userService_1.userService.updateAvatar(userId, avatarUrl);
            res.json({
                success: true,
                message: 'Avatar updated successfully',
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async deleteAccount(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const result = await userService_1.userService.deleteAccount(userId);
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
//# sourceMappingURL=userController.js.map