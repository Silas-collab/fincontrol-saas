"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workspaceController_1 = require("../controllers/workspaceController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', workspaceController_1.workspaceController.create);
router.get('/', workspaceController_1.workspaceController.getAll);
router.get('/:id', workspaceController_1.workspaceController.getById);
router.put('/:id', workspaceController_1.workspaceController.update);
router.delete('/:id', workspaceController_1.workspaceController.delete);
router.post('/:id/invite', workspaceController_1.workspaceController.inviteMember);
router.delete('/:id/members/:memberId', workspaceController_1.workspaceController.removeMember);
exports.default = router;
//# sourceMappingURL=workspaceRoutes.js.map