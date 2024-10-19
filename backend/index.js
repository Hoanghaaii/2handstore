import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import imageRoutes from './routes/image.route.js';
import eventRoutes from './routes/event.route.js';
import productRoutes from './routes/product.router.js';
import categoryRouter from './routes/category.router.js';
import cors from 'cors';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

// Cấu hình CORS trước khi định nghĩa các route
app.use(cors({
    origin: process.env.CLIENT_URL, // Địa chỉ frontend của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Các phương thức bạn muốn cho phép
    credentials: true, // Nếu bạn cần cookie hoặc thông tin xác thực
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Định nghĩa các route sau khi cấu hình CORS
app.use('/api/auth/', authRoutes);
app.use('/api/event/', imageRoutes);
app.use('/api/event/', eventRoutes);
app.use('/api/product/', productRoutes);
app.use('/api/category/', categoryRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Kết nối đến MongoDB khi server khởi động
});
