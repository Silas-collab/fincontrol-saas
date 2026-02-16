"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budgetController_1 = require("../controllers/budgetController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', budgetController_1.budgetController.create);
router.get('/', budgetController_1.budgetController.getAll);
router.get('/:id', budgetController_1.budgetController.getById);
router.put('/:id', budgetController_1.budgetController.update);
router.delete('/:id', budgetController_1.budgetController.delete);
exports.default = router;
//# sourceMappingURL=budgetRoutes.js.map