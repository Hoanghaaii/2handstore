import express from 'express';

import { signIn, signOut, signUp, verifyEmail, checkAuth,forgotPassword, resetPassword} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';


const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth);

router.post('/signup', signUp)

router.post('/signin', signIn)

router.post('/signout', signOut)

router.post('/verify-email', verifyEmail)

router.post('/forgot-password', forgotPassword)

router.post('/reset-password/:token', resetPassword)
export default router;