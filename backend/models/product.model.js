import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  imageUrl: [{ type: String, required: true}],
  author: { type:String, require: true }, // Người bán
  status: { 
    type: String, 
    enum: ['available', 'sold', 'pending'], // Trạng thái có thể là "available", "sold" (đã bán), hoặc "pending" (chờ xử lý)
    default: 'available'
  },
  category: [{ type: String, require: true}]
  // Các trường khác như hình ảnh, loại sản phẩm, v.v.
});

export default mongoose.model('Product', productSchema);
