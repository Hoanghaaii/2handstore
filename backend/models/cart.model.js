import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        productName:{type: String, required: true},
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
        imageUrl: [{ type: String, required: true}]
    }],
    totalPrice: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Cart', cartSchema);
