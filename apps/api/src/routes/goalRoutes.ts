import { Router } from 'express';
import { goalController } from '../controllers/goalController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', goalController.create);
router.get('/', goalController.getAll);
router.get('/:id', goalController.getById);
router.put('/:id', goalController.update);
router.delete('/:id', goalController.delete);
router.post('/:id/contribute', goalController.addContribution);

export default router;
