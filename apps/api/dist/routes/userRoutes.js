"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', userController_1.userController.getAll);
router.get('/:id', userController_1.userController.getById);
router.put('/avatar', userController_1.userController.updateAvatar);
router.delete('/account', userController_1.userController.deleteAccount);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map