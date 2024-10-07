import dotenv from 'dotenv'
import express from 'express';
import {connectDB} from './db/connectDB.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('Hello, World!');
})

app.use('/api/auth/', authRoutes)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    connectDB(); // Connect to MongoDB on server start up.
})