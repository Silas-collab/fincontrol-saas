import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', categoryController.create);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
