import express from 'express';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { createOrder, verifiedPayment, getMyOrder, getUserorders, getAllOrderAdmin } from '../controllers/orderController.js';

const router = express.Router() 

router.post('/create-order',isAuthenticated, createOrder)
router.post('/verify-payment',isAuthenticated, verifiedPayment)
router.get('/myorder', isAuthenticated, getMyOrder)
router.get('/all', isAuthenticated,isAdmin, getUserorders)
router.get('/user-order/:userId', isAuthenticated,isAdmin, getAllOrderAdmin)

export default router
