import express from 'express';
import PayOS from '@payos/node';
import Order from '../models/order.model.js';
import { generateOrderCodeFromId } from '../utils/generateOrderCodeFromId.js';

const router = express.Router();
const payos = new PayOS(process.env.POS_CLIENT_ID, process.env.POS_API_KEY, process.env.POS_CHECKSUM_KEY);

router.post('/create-payment-link', async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderCode = order.orderCode || generateOrderCodeFromId(order._id.toString());
        if (!orderCode || orderCode.toString().length > 15) {
            return res.status(400).json({ message: 'Invalid orderCode' });
        }

        const totalAmount = order.totalAmount || 0;
        if (totalAmount <= 0) {
            return res.status(400).json({ message: 'Total amount must be greater than zero' });
        }

        const description = `Thanh toán đơn hàng #${orderCode}`.substring(0, 25);
        const items = order.products?.map(item => ({
            name: item.productId?._id,
            quantity: item.quantity,
            price: item.price,
        })) || [];

        if (items.length === 0) {
            return res.status(400).json({ message: 'No products found in the order' });
        }

        const paymentOrder = {
            amount: totalAmount,
            description: description,
            orderCode: orderCode,
            returnUrl: `${process.env.CLIENT_URL}/success.html`,
            cancelUrl: `${process.env.CLIENT_URL}/order`,
            items: items,
        };

        const paymentLink = await payos.createPaymentLink(paymentOrder);
        order.paymentLink = paymentLink.checkoutUrl;
        await order.save();
        res.status(200).json({ checkOutUrl: paymentLink.checkoutUrl });
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).json({ message: 'Error creating payment link', error: error.message });
    }
});

router.post('/cancel-payment', async (req, res) => {
    const { orderCode, cancellationReason } = req.body;

    if (!orderCode) {
        return res.status(400).json({ error: 'orderCode is required' });
    }

    try {
        const cancelledPaymentLinkInfo = await payos.cancelPaymentLink(orderCode, cancellationReason);

        // Trả về thông tin đã hủy
        res.status(200).json({
            success: true,
            data: cancelledPaymentLinkInfo,
        });
    } catch (error) {
        console.error('Error cancelling payment link:', error);
        res.status(500).json({ error: 'Lỗi khi hủy thanh toán.' });
    }
});

router.get('/get-payment-link', async (req, res) => {
    const { orderCode } = req.query;

    try {
        const paymentLink = await payos.getPaymentLinkInformation(orderCode);
        if (!paymentLink) {
            return res.status(404).json({ message: 'Không tìm thấy link thanh toán.' });
        }

        return res.status(200).json(paymentLink);
    } catch (error) {
        console.error("Error retrieving payment link:", error);
        return res.status(500).json({ message: 'Có lỗi xảy ra khi lấy thông tin link thanh toán.' });
    }
});
router.post('/receive-hook', async (req, res) => {
    const paymentData = req.body;

    // Kiểm tra xem giao dịch có thành công hay không
    if (paymentData.success) {
        // Tìm kiếm đơn hàng dựa vào orderCode
        const orderCode = paymentData.data.orderCode;
        console.log(orderCode)
        try {
            const order = await Order.findOne({ orderCode: orderCode });
            console.log(order)
            if (order) {
                // Cập nhật trạng thái đơn hàng hoặc thực hiện hành động cần thiết
                console.log("Giao dịch thành công:", paymentData.data);
                // Cập nhật thông tin đơn hàng tại đây
                order.paymentStatus = 'Paid'; // Hoặc bất kỳ trạng thái nào phù hợp
                await order.save();

                res.status(200).json({ message: "Giao dịch thành công", order });
            } else {
                res.status(404).json({ message: "Đơn hàng không tìm thấy" });
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm đơn hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    } else {
        // Xử lý lỗi
        console.log("Giao dịch không thành công:", paymentData.desc);
        res.status(400).json({ message: "Giao dịch không thành công", error: paymentData.desc });
    }
});


export default router;
