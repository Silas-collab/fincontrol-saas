"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bcryptConfig = exports.jwtConfig = void 0;
exports.jwtConfig = {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    expiresIn: '24h',
    refreshExpiresIn: '7d',
};
exports.bcryptConfig = {
    saltRounds: 10,
};
//# sourceMappingURL=auth.js.map