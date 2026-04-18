import express from 'express';
import { createOrder, getMyOrders, createCheckoutSession, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All order routes are protected

router.post('/', createOrder);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);

export default router;