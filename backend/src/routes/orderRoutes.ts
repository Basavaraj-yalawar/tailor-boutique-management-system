import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { authenticateAny } from '../middleware/auth';

const router = Router();

router.post('/', authenticateAny, orderController.createOrder);
router.get('/', authenticateAny, orderController.getAllOrders);
router.get('/customer/:customerId', authenticateAny, orderController.getOrdersByCustomer);
router.get('/:id', authenticateAny, orderController.getOrderById);
router.put('/:id', authenticateAny, orderController.updateOrder);
router.patch('/:id/status', authenticateAny, orderController.updateOrderStatus);
router.delete('/:id', authenticateAny, orderController.deleteOrder);

export default router;
