import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.put('/avatar', userController.updateAvatar);
router.delete('/account', userController.deleteAccount);

export default router;
