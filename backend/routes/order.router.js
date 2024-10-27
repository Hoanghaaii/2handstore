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

// Route để đặt hàng
router.post('/', verifyToken, placeOrder);

// Route để lấy tất cả đơn hàng của người dùng
router.get('/all-orders', verifyToken, getOrders);

// Route để lấy thông tin chi tiết của một đơn hàng theo ID
router.get('/get-by-seller', verifyToken, getOrdersBySeller);
router.patch('/:orderId/status', verifyToken, updateOrderStatus); // Route mới để cập nhật trạng thái đơn hàng
router.get('/:orderId', verifyToken, getOrderById);

// Route để cập nhật trạng thái đơn hàng

// Route để cập nhật trạng thái thanh toán của đơn hàng
router.patch('/:orderId/payment-status', verifyToken, updatePaymentStatusOrder);

// Route để hủy đơn hàng
router.delete('/:orderId', verifyToken, cancelOrder);

export default router;
