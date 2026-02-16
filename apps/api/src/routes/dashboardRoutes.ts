import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/summary', dashboardController.getSummary);
router.get('/trends', dashboardController.getMonthlyTrend);
router.get('/breakdown', dashboardController.getCategoryBreakdown);

export default router;
