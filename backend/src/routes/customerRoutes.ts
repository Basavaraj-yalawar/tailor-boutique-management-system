import { Router } from 'express';
import * as customerController from '../controllers/customerController';
import { authenticateAny } from '../middleware/auth';

const router = Router();

router.post('/', authenticateAny, customerController.createCustomer);
router.get('/', authenticateAny, customerController.getAllCustomers);
router.get('/search/:phone', authenticateAny, customerController.searchByPhone);
router.get('/:id', authenticateAny, customerController.getCustomerById);
router.put('/:id', authenticateAny, customerController.updateCustomer);
router.delete('/:id', authenticateAny, customerController.deleteCustomer);

export default router;
