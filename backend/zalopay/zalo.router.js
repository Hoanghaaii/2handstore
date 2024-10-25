import express from 'express'
import { callBack, createPayment } from './zalo.js'

const router = express.Router()

router.post('/payment', createPayment)
router.post('/callback', callBack) 

export default router;