import express from "express";
import { register, verify, reVerify, login, logout, forgotPassword, verifyOTP, changePassword, allUser, getUserById, updateUser, addAddress, getAddresses } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", register);
router.get('/verify', verify)
router.post('/reverify', reVerify)
router.post('/login', login)
router.post('/logout', isAuthenticated, logout)
router.post('/forgot-password', forgotPassword)
router.post('/verify-otp/:email', verifyOTP)
router.post('/change-password/:email', changePassword)
router.get('/all-user',isAuthenticated ,isAdmin, allUser)
router.get('/get-user/:userId', getUserById)
router.put('/update/:id', isAuthenticated, singleUpload, updateUser)
router.post('/add-address', isAuthenticated, addAddress)
router.get('/get-addresses', isAuthenticated, getAddresses)







export default router;