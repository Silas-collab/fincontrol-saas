"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const goalController_1 = require("../controllers/goalController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', goalController_1.goalController.create);
router.get('/', goalController_1.goalController.getAll);
router.get('/:id', goalController_1.goalController.getById);
router.put('/:id', goalController_1.goalController.update);
router.delete('/:id', goalController_1.goalController.delete);
router.post('/:id/contribute', goalController_1.goalController.addContribution);
exports.default = router;
//# sourceMappingURL=goalRoutes.js.map