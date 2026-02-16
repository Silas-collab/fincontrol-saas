"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', categoryController_1.categoryController.create);
router.get('/', categoryController_1.categoryController.getAll);
router.get('/:id', categoryController_1.categoryController.getById);
router.put('/:id', categoryController_1.categoryController.update);
router.delete('/:id', categoryController_1.categoryController.delete);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map