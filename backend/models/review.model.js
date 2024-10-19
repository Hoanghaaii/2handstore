import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Liên kết với sản phẩm
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đánh giá
  rating: { type: Number, required: true, min: 1, max: 5 }, // Số sao đánh giá
  comment: { type: String, required: true }, // Nội dung đánh giá
  createdAt: { type: Date, default: Date.now }, // Thời gian đánh giá
});

module.exports = mongoose.model('Review', reviewSchema);
