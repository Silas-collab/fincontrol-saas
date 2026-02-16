"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const accountController_1 = require("../controllers/accountController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', accountController_1.accountController.create);
router.get('/', accountController_1.accountController.getAll);
router.get('/:id', accountController_1.accountController.getById);
router.put('/:id', accountController_1.accountController.update);
router.delete('/:id', accountController_1.accountController.delete);
exports.default = router;
//# sourceMappingURL=accountRoutes.js.map