import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct, getBestSellerProducts,getCategories } from "../controllers/productController.js";
import { MultipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, MultipleUpload, addProduct);
router.get('/getallproducts', getAllProduct)
router.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct)
router.put('/update/:productId', isAuthenticated, isAdmin, MultipleUpload, updateProduct)
router.get('/best-seller', getBestSellerProducts)
router.get('/categories', getCategories)
export default router;