import express from 'express';
import { getProduct, getProductByCategory, getProductById, getProductByName, postProduct } from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadMiddleWare } from '../controllers/image.controller.js';

const router = express.Router();


router.get('/', getProduct );
router.get('/get-by-id/:id', getProductById);
router.get('/get-by-category/:category', getProductByCategory);
router.get('/get-by-name/:name', getProductByName);
router.post('/',uploadMiddleWare ,verifyToken, postProduct);
export default router;