"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', transactionController_1.transactionController.create);
router.get('/', transactionController_1.transactionController.getAll);
router.get('/summary', transactionController_1.transactionController.getSummary);
router.get('/:id', transactionController_1.transactionController.getById);
router.put('/:id', transactionController_1.transactionController.update);
router.delete('/:id', transactionController_1.transactionController.delete);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map