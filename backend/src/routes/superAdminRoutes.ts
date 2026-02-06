import { Router } from 'express';
import * as superAdminController from '../controllers/superAdminController';
import { authenticateSuperAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', superAdminController.login);
router.post('/admins', authenticateSuperAdmin, superAdminController.createAdmin);
router.get('/admins', authenticateSuperAdmin, superAdminController.getAllAdmins);
router.patch('/admins/:id/toggle-status', authenticateSuperAdmin, superAdminController.toggleAdminStatus);
router.delete('/admins/:id', authenticateSuperAdmin, superAdminController.deleteAdmin);

export default router;
