"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_2 = require("./config/cors");
const errorHandler_1 = require("./middleware/errorHandler");
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const workspaceRoutes_1 = __importDefault(require("./routes/workspaceRoutes"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const budgetRoutes_1 = __importDefault(require("./routes/budgetRoutes"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)(cors_2.corsConfig));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'FinControl API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/workspaces', workspaceRoutes_1.default);
app.use('/api/accounts', accountRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/budgets', budgetRoutes_1.default);
app.use('/api/goals', goalRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});
// Error handler
app.use(errorHandler_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════════════════╗`);
    console.log(`║     🚀 FinControl API Server Started!              ║`);
    console.log(`╠════════════════════════════════════════════════════╣`);
    console.log(`║  Port: ${PORT}                                     ║`);
    console.log(`║  Health: http://localhost:${PORT}/health               ║`);
    console.log(`║  API: http://localhost:${PORT}/api                     ║`);
    console.log(`╚════════════════════════════════════════════════════╝\n`);
});
exports.default = app;
//# sourceMappingURL=index.js.map