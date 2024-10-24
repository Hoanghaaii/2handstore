import express from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { cancelOrder, getOrders, placeOrder } from '../controllers/order.controller.js'
const router = express.Router()

router.post('/', verifyToken, placeOrder)
router.get('/all-orders', verifyToken, getOrders)
router.delete('/:orderId', verifyToken, cancelOrder);

export default router