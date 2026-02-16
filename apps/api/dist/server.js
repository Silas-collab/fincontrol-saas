"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const budgetRoutes_1 = __importDefault(require("./routes/budgetRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const workspaceRoutes_1 = __importDefault(require("./routes/workspaceRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});
// API Info
app.get('/api', (req, res) => {
    res.json({
        message: 'FinControl API v1.0.0',
        endpoints: [
            '/api/auth',
            '/api/users',
            '/api/accounts',
            '/api/transactions',
            '/api/categories',
            '/api/budgets',
            '/api/goals',
            '/api/dashboard',
            '/api/workspaces'
        ]
    });
});
// Register all routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/accounts', accountRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/budgets', budgetRoutes_1.default);
app.use('/api/goals', goalRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/workspaces', workspaceRoutes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});
// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 FinControl API running on port ${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 Auth endpoint: http://localhost:${PORT}/api/auth`);
});
exports.default = app;
//# sourceMappingURL=server.js.map