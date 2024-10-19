import express from 'express';
import { getImage, postImage, uploadMiddleWare } from '../controllers/image.controller.js';
const router = express.Router();

router.get('/image',(req, res)=> getImage(req, res, 'event'))
router.post('/image', uploadMiddleWare, (req, res)=> {
    console.log('POST request received at /image'); // Thêm log này
    postImage(req, res, 'event')})
export default router;
