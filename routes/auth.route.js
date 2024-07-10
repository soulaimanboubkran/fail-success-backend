import express from 'express'
import { SignIn, SignUp,forgotPass,resetPass,ResetPass,google } from '../controllers/auth.controller.js';



const router = express.Router()

router.post('/sign-up',SignUp)
router.post('/sign-in',SignIn)

router.post('/forgot-password',forgotPass);//he will post rcupiration email
router.get('/reset-password/:id/:token',resetPass);
router.post('/reset-password/:id/:token',ResetPass);//he will post the new password
router.post("/google",google);

export default router;