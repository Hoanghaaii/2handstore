import express from 'express';
import { getCategory, getCategoryByName, postCategory } from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', getCategory)
router.get('/:name', getCategoryByName)
router.post('/', postCategory)  

export default router;
