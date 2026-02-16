"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = require("../config/prisma");
const password_1 = require("../utils/password");
const token_1 = require("../utils/token");
const errorHandler_1 = require("../middleware/errorHandler");
exports.authService = {
    async register(data) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new errorHandler_1.AppError('Email already registered', 409);
        }
        const passwordHash = await (0, password_1.hashPassword)(data.password);
        const user = await prisma_1.prisma.user.create({
            data: {
                email: data.email,
                passwordHash,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
            },
        });
        // Create default workspace
        const workspace = await prisma_1.prisma.workspace.create({
            data: {
                name: 'Personal',
                slug: `personal-${user.id.slice(0, 8)}`,
                type: 'personal',
                currency: 'BRL',
            },
        });
        await prisma_1.prisma.workspaceMember.create({
            data: {
                workspaceId: workspace.id,
                userId: user.id,
                role: 'OWNER',
            },
        });
        const accessToken = (0, token_1.generateAccessToken)(user.id);
        const refreshToken = (0, token_1.generateRefreshToken)(user.id);
        return {
            user,
            workspace,
            tokens: { accessToken, refreshToken },
        };
    },
    async login(data) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        const isValidPassword = await (0, password_1.comparePassword)(data.password, user.passwordHash);
        if (!isValidPassword) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        await prisma_1.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const workspaces = await prisma_1.prisma.workspaceMember.findMany({
            where: { userId: user.id },
            include: { workspace: true },
        });
        const accessToken = (0, token_1.generateAccessToken)(user.id);
        const refreshToken = (0, token_1.generateRefreshToken)(user.id);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
            },
            workspaces: workspaces.map(w => w.workspace),
            tokens: { accessToken, refreshToken },
        };
    },
    async refreshToken(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
            },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const accessToken = (0, token_1.generateAccessToken)(user.id);
        return { user, accessToken };
    },
    async getProfile(userId) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
                phone: true,
                emailVerified: true,
                twoFactorEnabled: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return user;
    },
    async updateProfile(userId, data) {
        const user = await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
            },
        });
        return user;
    },
    async changePassword(userId, oldPassword, newPassword) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const isValidPassword = await (0, password_1.comparePassword)(oldPassword, user.passwordHash);
        if (!isValidPassword) {
            throw new errorHandler_1.AppError('Current password is incorrect', 400);
        }
        const newPasswordHash = await (0, password_1.hashPassword)(newPassword);
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newPasswordHash },
        });
        return { message: 'Password changed successfully' };
    },
};
//# sourceMappingURL=authService.js.map