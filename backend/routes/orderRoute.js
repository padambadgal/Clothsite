import express from 'express';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { createOrder, verifiedPayment } from '../controllers/orderController.js';

const router = express.Router() 

router.post('/create-order',isAuthenticated, createOrder)
router.post('/verify-payment',isAuthenticated, verifiedPayment)

export default router
