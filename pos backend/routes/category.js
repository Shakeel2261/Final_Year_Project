import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);      // Create category
router.get("/", getCategories);        // Get all categories
router.get("/:id", getCategoryById);   // Get single category
router.put("/:id", updateCategory);    // Update category
router.delete("/:id", deleteCategory); // Delete category

export default router;
