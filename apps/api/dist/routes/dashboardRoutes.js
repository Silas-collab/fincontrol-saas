"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/summary', dashboardController_1.dashboardController.getSummary);
router.get('/trends', dashboardController_1.dashboardController.getMonthlyTrend);
router.get('/breakdown', dashboardController_1.dashboardController.getCategoryBreakdown);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map