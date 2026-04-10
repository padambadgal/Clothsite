import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import productRoute from './routes/productRoutes.js'
import cartRoute from './routes/cartRoute.js'
const app = express();

connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))
app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/cart", cartRoute);



app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});