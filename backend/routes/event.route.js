import express from 'express';
import { deleteEvent, getEvent, getEventById, postEvent, putEvent } from '../controllers/event.controller.js';
import multer from 'multer';
import { uploadMiddleWare } from '../controllers/image.controller.js';


const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getEvent);
router.get('/:id', getEventById);
router.post('/',uploadMiddleWare, postEvent)
router.put('/:id', uploadMiddleWare, putEvent);
router.delete('/:id', deleteEvent)

export default router;