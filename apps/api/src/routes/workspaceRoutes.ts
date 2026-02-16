import { Router } from 'express';
import { workspaceController } from '../controllers/workspaceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', workspaceController.create);
router.get('/', workspaceController.getAll);
router.get('/:id', workspaceController.getById);
router.put('/:id', workspaceController.update);
router.delete('/:id', workspaceController.delete);
router.post('/:id/invite', workspaceController.inviteMember);
router.delete('/:id/members/:memberId', workspaceController.removeMember);

export default router;
