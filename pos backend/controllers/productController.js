import Product from "../models/product.js";
import Category from "../models/category.js";

// Create Product with Image
export const createProduct = async (req, res) => {
  try {
    const {
      productName,
      productCode,
      category,
      price,
      description,
      stockQuantity,
      status,
    } = req.body;

    // Validate required fields
    if (!productName || !productCode || !category || !price) {
      return res.status(400).json({
        message:
          "Missing required fields: productName, productCode, category, and price are required",
      });
    }

    // Find category by name or use as ObjectId
    let categoryId = category;
    if (typeof category === "string" && !category.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a string and not a valid ObjectId, treat it as category name
      const foundCategory = await Category.findOne({ name: category });
      if (!foundCategory) {
        return res.status(400).json({
          message: `Category "${category}" not found. Please create the category first or use a valid category ID.`,
        });
      }
      categoryId = foundCategory._id;
    }

    // Handle image upload - only set imageUrl if file exists and was uploaded successfully
    let imageUrl = null;
    if (req.file && req.file.filename) {
      // Verify the file actually exists on disk
      const fs = await import("fs");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "uploads", req.file.filename);

      if (fs.existsSync(filePath)) {
        imageUrl = `/uploads/${req.file.filename}`;
        console.log(`✅ Image uploaded successfully: ${req.file.filename}`);
      } else {
        console.error(`❌ File not found on disk: ${filePath}`);
        return res.status(400).json({
          message: "File upload failed - file not saved properly",
        });
      }
    }

    const product = new Product({
      productName,
      productCode,
      category: categoryId,
      price,
      description,
      stockQuantity,
      imageUrl,
      status: status || "active", // default to active if not provided
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name discount");
    const total = await Product.countDocuments();

    res.json({
      success: true,
      totalRecords: total,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Product By Id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name discount"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Product (with optional new image)
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    if (req.file && req.file.filename) {
      // Verify the file actually exists on disk
      const fs = await import("fs");
      const path = await import("path");
      const filePath = path.join(process.cwd(), "uploads", req.file.filename);

      if (fs.existsSync(filePath)) {
        updates.imageUrl = `/uploads/${req.file.filename}`;
        console.log(`✅ Image updated successfully: ${req.file.filename}`);
      } else {
        console.error(`❌ File not found on disk: ${filePath}`);
        return res.status(400).json({
          message: "File upload failed - file not saved properly",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Products By Category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category, status: "active" }); // only active ones
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.json({
      success: true,
      totalRecords: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
