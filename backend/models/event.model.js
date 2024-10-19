import mongoose from 'mongoose';

// Định nghĩa schema cho sự kiện
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Tên sự kiện
    dateFrom: { type: Date, required: true }, // Ngày bắt đầu
    dateTo: { type: Date, required: true },   // Ngày kết thúc
    location: { type: String, required: true }, // Địa điểm tổ chức sự kiện
    imageUrl: { type: String, required: true }, // Đường dẫn hình ảnh (lưu trong S3)
    content: { type: String, required: true },   // Nội dung sự kiện (HTML)
    createdAt: { type: Date, default: Date.now }, // Ngày tạo sự kiện
});

// Tạo mô hình từ schema
const Event = mongoose.model('Event', eventSchema);

export default Event;
