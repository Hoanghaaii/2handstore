import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  imageUrl: [{ type: String, required: true }],
  author: { type: String, required: true }, // Người bán
  status: { 
    type: String, 
    enum: ['available', 'sold'], // Trạng thái có thể là "available", "sold" (đã bán), hoặc "pending" (chờ xử lý)
    default: 'available'
  },
  category: [{ type: String, required: true }], // Sửa typo từ "require" thành "required"
}, {
  timestamps: true, // Thêm trường createdAt và updatedAt tự động
});

// Xuất mô hình Product
export default mongoose.model('Product', productSchema);
