import express from 'express';
import { getProduct, getProductByCategory, getProductById, getProductByName, getProductBySeller, postProduct } from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadMiddleWare } from '../controllers/image.controller.js';

const router = express.Router();


router.get('/', getProduct );
router.get('/get-by-owner',verifyToken, getProductBySeller )
router.get('/:id', getProductById);
router.get('/get-by-category/:category', getProductByCategory);
router.get('/search/:name', getProductByName);
router.post('/add-product',uploadMiddleWare ,verifyToken, postProduct);
export default router;