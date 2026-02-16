"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post('/register', authController_1.authController.register);
router.post('/login', authController_1.authController.login);
router.post('/refresh-token', authController_1.authController.refreshToken);
// Protected routes
router.get('/profile', auth_1.authenticate, authController_1.authController.getProfile);
router.put('/profile', auth_1.authenticate, authController_1.authController.updateProfile);
router.put('/change-password', auth_1.authenticate, authController_1.authController.changePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map