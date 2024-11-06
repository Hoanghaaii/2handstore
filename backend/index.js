import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import imageRoutes from './routes/image.route.js';
import eventRoutes from './routes/event.route.js';
import productRoutes from './routes/product.router.js';
import categoryRouter from './routes/category.router.js';
import cartRouter from './routes/cart.router.js';
import orderRouter from './routes/order.router.js';
import zaloRouter from './zalopay/zalo.router.js'
import cors from 'cors';
import bodyParser from 'body-parser';
import paymentRouter from './vietqr/payment.router.js'

const app = express();
app.use(express.static('public'))
dotenv.config();

const PORT = process.env.PORT || 3001;
app.use(bodyParser.json()); // Sử dụng bodyParser cho toàn bộ app
// Cấu hình CORS trước khi định nghĩa các route
const allowedOrigins = ["https://2handstore.id.vn", "https://2handstore.vercel.app", "http://localhost:3000"];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}));



app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Định nghĩa các route sau khi cấu hình CORS
app.use('/api/auth/', authRoutes);
app.use('/api/events/', imageRoutes);
app.use('/api/event/', eventRoutes);
app.use('/api/product/', productRoutes);
app.use('/api/category/', categoryRouter);
app.use('/api/cart/', cartRouter);
app.use('/api/order/', orderRouter );
app.use('/api/zalopay/', zaloRouter);
app.use('/api/payment', paymentRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Kết nối đến MongoDB khi server khởi động
});
