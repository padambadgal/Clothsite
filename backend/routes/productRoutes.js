import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct } from "../controllers/productController.js";
import { MultipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, MultipleUpload, addProduct);
router.get('/getallproducts', getAllProduct)
router.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct)
router.put('/update/:productId', isAuthenticated, isAdmin, MultipleUpload, updateProduct)


export default router;