import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from "../controllers/productController.js";
import upload, { handleUploadError } from "../middleware/upload.js";

const router = express.Router();

// Routes
router.post("/", upload.single("image"), handleUploadError, createProduct);
router.get("/", getProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);
router.put("/:id", upload.single("image"), handleUploadError, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
