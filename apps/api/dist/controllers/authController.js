"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("../services/authService");
const errorHandler_1 = require("../middleware/errorHandler");
exports.authController = {
    async register(req, res, next) {
        try {
            const { email, password, firstName, lastName } = req.body;
            if (!email || !password || !firstName || !lastName) {
                throw new errorHandler_1.AppError('All fields are required', 400);
            }
            const result = await authService_1.authService.register({
                email,
                password,
                firstName,
                lastName,
            });
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new errorHandler_1.AppError('Email and password are required', 400);
            }
            const result = await authService_1.authService.login({ email, password });
            res.json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                throw new errorHandler_1.AppError('Refresh token required', 400);
            }
            // Verify refresh token logic would go here
            // For now, simplified version
            res.json({
                success: true,
                message: 'Token refreshed',
                data: { accessToken: refreshToken },
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const profile = await authService_1.authService.getProfile(userId);
            res.json({
                success: true,
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async updateProfile(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const { firstName, lastName, email } = req.body;
            const profile = await authService_1.authService.updateProfile(userId, { firstName, lastName, email });
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: profile,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async changePassword(req, res, next) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                throw new errorHandler_1.AppError('Authentication required', 401);
            }
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                throw new errorHandler_1.AppError('Old and new password are required', 400);
            }
            const result = await authService_1.authService.changePassword(userId, oldPassword, newPassword);
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
//# sourceMappingURL=authController.js.map