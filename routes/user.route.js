import express from 'express';
import { verifyToken, verifyTokenAndAuthorization } from '../utils/verifyToken.js'; // Ensure correct import
import { getUserStringList } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/strings/:id', verifyTokenAndAuthorization, getUserStringList);

export default router;
