import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';


import {
    addItemToCart,
    removeItemFromCart,
    getCart
} from '../controllers/cart.controller.js';

const router = express.Router();

// Routes với xác thực
router.post('/add', verifyToken, addItemToCart); // Thêm sản phẩm vào giỏ hàng
router.delete('/remove/:productId', verifyToken, removeItemFromCart); // Xóa sản phẩm khỏi giỏ hàng
router.get('/', verifyToken, getCart); // Lấy giỏ hàng

export default router;
