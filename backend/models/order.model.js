import mongoose from 'mongoose';

const orderSchema = mongoose.Schema(
    {
        buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người mua
        products: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true }, // Giá từng sản phẩm tại thời điểm đặt hàng
                author: { type: String, required: true },
            }
        ],
        totalAmount: { type: Number, required: true }, // Tổng số tiền cho đơn hàng
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], // Trạng thái đơn hàng
            default: 'Pending'
        },
        shippingAddress: { type: String, required: true }, // Địa chỉ giao hàng
        paymentMethod: { type: String, enum: ['COD', 'Banking'], default: 'COD' }, // Phương thức thanh toán
        paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' }, // Trạng thái thanh toán
        orderDate: { type: Date, default: Date.now }, // Ngày đặt hàng
        orderCode: { type: Number, unique: true }, // Mã đơn hàng
        paymentLink: { type: String } // Liên kết thanh toán
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
