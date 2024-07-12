import express from 'express';
import { createThing, deleteThing, getThings, setState } from '../controllers/thing.controller.js';
import { verifyToken, verifyTokenAndAuthorization } from '../utils/verifyToken.js'; // Ensure correct import

const router = express.Router();

router.post('/addThing', verifyToken, createThing);
router.post('/things/:id', verifyTokenAndAuthorization, getThings);
router.put('/setState/:id', setState);
router.delete('/deleteThing/:id', deleteThing);
export default router;
