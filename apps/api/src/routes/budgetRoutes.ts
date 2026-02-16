import { Router } from 'express';
import { budgetController } from '../controllers/budgetController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', budgetController.create);
router.get('/', budgetController.getAll);
router.get('/:id', budgetController.getById);
router.put('/:id', budgetController.update);
router.delete('/:id', budgetController.delete);

export default router;
