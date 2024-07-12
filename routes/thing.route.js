import express from 'express';
import { createThing, getThings } from '../controllers/thing.controller.js';
import { verifyToken, verifyTokenAndAuthorization } from '../utils/verifyToken.js'; // Ensure correct import

const router = express.Router();

router.post('/addThing', verifyToken, createThing);
router.post('/things/:id', verifyTokenAndAuthorization, getThings);

export default router;
