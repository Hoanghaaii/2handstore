import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import {
  cancelOrder,
  getOrders,
  placeOrder,
  getOrderById,
  updatePaymentStatusOrder,
  getOrdersBySeller,
  updateOrderStatus, // Import phương thức cập nhật trạng thái
} from '../controllers/order.controller.js';

const router = express.Router();
router.post('/', verifyToken, placeOrder);
router.get('/all-orders', verifyToken, getOrders);
router.get('/get-by-seller', verifyToken, getOrdersBySeller);
router.patch('/:orderId/status', verifyToken, updateOrderStatus);
router.get('/:orderId', verifyToken, getOrderById);
router.patch('/:orderId/payment-status', verifyToken, updatePaymentStatusOrder);
router.delete('/:orderId', verifyToken, cancelOrder);

export default router;
