import express from 'express';

import { signIn, signOut, signUp, verifyEmail, checkAuth,forgotPassword, resetPassword, updateAccount, getUserById, resendVerificationCode} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { uploadMiddleWare } from '../controllers/image.controller.js';


const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);

router.get('/get-user-by-id/:id', getUserById)

router.post('/signup', signUp)

router.post('/signin', signIn)

router.post('/signout', signOut)

router.post('/verify-email', verifyEmail)

router.post('/resend-verify-email', resendVerificationCode)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.put('/update-account/:id',uploadMiddleWare, verifyToken, updateAccount)
export default router;