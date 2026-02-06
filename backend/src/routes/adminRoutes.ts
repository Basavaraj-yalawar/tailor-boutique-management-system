import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', adminController.login);
router.get('/profile', authenticateAdmin, adminController.getProfile);
router.put('/profile', authenticateAdmin, adminController.updateProfile);

export default router;
