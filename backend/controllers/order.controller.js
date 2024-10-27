import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import crc from 'crc'

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
            createdAt: new Date() // Thêm thời gian đặt hàng,
        });
        newOrder.orderCode = parseInt(crc.crc32(newOrder._id.toString()).toString(10), 10);

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

export const getOrderById = async (req, res) => {
    const { orderId } = req.params; // Lấy orderId từ params
    const userId = req.userId; // Giả định rằng userId đã có sẵn từ middleware

    try {
        // Tìm đơn hàng theo orderId và xác thực người dùng
        const order = await Order.findById(orderId)
            .populate('products.productId')
            .populate('buyer', 'email');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        return res.status(200).json({
            success: true,
            order: {
                ...order.toObject(),
                buyer: {
                    email: order.buyer.email,
                },
            },
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updatePaymentStatusOrder = async (req, res) => {
    const { orderId } = req.params; // Lấy orderId từ params
    const userId = req.userId; // Giả định rằng userId đã có sẵn từ middleware
    const { paymentStatus } = req.body; // Trạng thái thanh toán được truyền vào

    try {
        // Tìm đơn hàng theo orderId
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Kiểm tra quyền sở hữu
        if (order.buyer.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this order' });
        }

        // Cập nhật trạng thái thanh toán nếu được cung cấp
        if (paymentStatus) {
            order.paymentStatus = paymentStatus; // Cập nhật trạng thái thanh toán
        }

        // Lưu thay đổi vào cơ sở dữ liệu
        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Payment status updated successfully',
            order
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getOrdersBySeller = async (req, res) => {
    const sellerId = req.userId; // Giả sử sellerId đã được xác thực qua middleware
    try {
        // Truy vấn cơ sở dữ liệu để lấy email người bán dựa trên sellerId
        const seller = await User.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ error: "Người bán không tồn tại." });
        }
        
        const sellerEmail = seller.email;

        // Lấy tất cả các đơn hàng có chứa sản phẩm của người bán (dựa trên email `author`)
        const orders = await Order.find({ "products.author": sellerEmail }).populate('buyer', 'email name avatar');;

        // Lọc các sản phẩm trong từng đơn hàng để chỉ lấy các sản phẩm thuộc người bán này
        const filteredOrders = orders.map(order => ({
            ...order.toObject(),
            products: order.products.filter(product => product.author === sellerEmail)
        }));

        // Sắp xếp đơn hàng theo trạng thái và thời gian tạo
        const sortedOrders = filteredOrders.sort((a, b) => {
            // Đưa đơn hàng đã hủy ("Cancelled") xuống dưới
            const statusA = a.status === "Cancelled" ? 1 : 0;
            const statusB = b.status === "Cancelled" ? 1 : 0;

            // Sắp xếp theo trạng thái trước
            if (statusA !== statusB) {
                return statusA - statusB; // Đơn hàng không hủy lên trước
            }

            // Nếu trạng thái bằng nhau, sắp xếp theo thời gian tạo
            return new Date(b.createdAt) - new Date(a.createdAt); // Đơn hàng mới nhất lên trước
        });

        res.status(200).json(sortedOrders);
    } catch (error) {
        console.error("Error fetching orders by seller:", error);
        res.status(500).json({ error: "Lỗi khi lấy đơn hàng." });
    }
};


export const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; // Lấy orderId từ params
    const userId = req.userId; // Giả định rằng userId đã có sẵn từ middleware
    const { orderStatus } = req.body; // Trạng thái đơn hàng được truyền vào
    try {
        // Tìm người dùng hiện tại để lấy email
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userEmail = user.email; // Lấy email của người dùng hiện tại
        // Tìm đơn hàng theo orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Kiểm tra quyền sở hữu dựa trên email của người bán
        const isAuthorized = order.products.some(product => product.author === userEmail);
        if (!isAuthorized) {
            return res.status(403).json({ success: false, message: 'Unauthorized to update this order' });
        }

        // Cập nhật trạng thái đơn hàng nếu được cung cấp
        if (orderStatus) {
            order.status = orderStatus; // Cập nhật trạng thái đơn hàng
        }

        // Lưu thay đổi vào cơ sở dữ liệu
        await order.save();
        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
