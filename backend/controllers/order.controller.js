import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

export const placeOrder = async (req, res) => {
    const { paymentMethod, shippingAddress } = req.body;
    const userId = req.userId; // Giả định rằng userId đã có sẵn từ middleware

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Tìm người dùng
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Nếu không truyền địa chỉ giao hàng, sử dụng địa chỉ mặc định từ người dùng
        const finalShippingAddress = shippingAddress || user.address;

        // Duyệt qua các sản phẩm trong giỏ hàng và lấy thông tin người bán từ `author`
        const products = await Promise.all(cart.items.map(async item => {
            const product = await Product.findById(item.productId);

            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            // Cập nhật số lượng sản phẩm trong kho
            product.quantity -= item.quantity;

            // Nếu số lượng về 0, cập nhật trạng thái thành "sold"
            if (product.quantity < 0) {
                throw new Error(`Not enough stock for product ID ${item.productId}`);
            } else if (product.quantity === 0) {
                product.status = 'sold';
            }

            // Lưu thay đổi trong cơ sở dữ liệu
            await product.save();

            return {
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
                author: product.author
            };
        }));

        // Tạo đơn hàng từ giỏ hàng
        const newOrder = new Order({
            buyer: userId,
            products,
            totalAmount: cart.totalPrice,
            shippingAddress: finalShippingAddress, 
            paymentMethod,
            createdAt: new Date() // Thêm thời gian đặt hàng
        });

        // Lưu đơn hàng vào cơ sở dữ liệu
        await newOrder.save();

        // Xóa giỏ hàng sau khi đặt hàng thành công
        await Cart.findOneAndDelete({ userId });

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: newOrder
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: error.message || 'Server error' });
    }
};

export const getOrders = async (req, res) => {
    const userId = req.userId;

    try {
        const orders = await Order.find({ buyer: userId })
            .populate('products.productId')
            .populate('buyer', 'email')
            .sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'No orders found' });
        }

        return res.status(200).json({
            success: true,
            orders: orders.map(order => ({
                ...order.toObject(),
                buyer: {
                    email: order.buyer.email,
                }
            })),
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const cancelOrder = async (req, res) => {
    const { orderId } = req.params;
    const userId = req.userId;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.buyer.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to cancel this order' });
        }

        await Promise.all(order.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            if (product) {
                product.quantity += item.quantity;
                product.status = 'available'; 
                await product.save();
            }
        }));

        order.status = 'Cancelled';
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
