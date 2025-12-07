// controllers/orderController.js
import Order from "../models/order.js";
import Product from "../models/product.js";
import Category from "../models/category.js";
import { createSalesLedgerEntry } from "./ledgerController.js";

// Create new order (with stock management and discount logic)
export const createOrder = async (req, res) => {
  try {
    const { customer, items, createdBy } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Order must contain at least 1 item" });
    }

    let totalAmount = 0;
    const orderItems = [];

    // First pass: validate products and calculate original total
    for (const item of items) {
      const product = await Product.findById(item.productId).populate(
        "category"
      );

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      // Check available stock (total stock - reserved stock)
      const availableStock = product.stockQuantity - product.reservedStock;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.productName}. Available: ${availableStock}`,
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // Check if discount should be applied (total >= 300,000)
    const shouldApplyDiscount = totalAmount >= 300000;

    // Second pass: apply discount logic and create order items
    for (const item of items) {
      const product = await Product.findById(item.productId).populate(
        "category"
      );

      let finalPrice = product.price;

      // Apply discount if conditions are met
      if (shouldApplyDiscount && product.category.discount > 0) {
        const discountAmount =
          (product.price * product.category.discount) / 100;
        finalPrice = product.price - discountAmount;
      }

      // Reserve stock instead of deducting
      product.reservedStock += item.quantity;
      await product.save();

      // Push into order items with final price
      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        finalPrice: finalPrice,
      });
    }

    // Recalculate total with discounts applied
    const finalTotalAmount = orderItems.reduce((total, item) => {
      return total + item.finalPrice * item.quantity;
    }, 0);

    const newOrder = new Order({
      customer,
      items: orderItems,
      totalAmount: finalTotalAmount,
      createdBy,
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully & stock reserved",
      order: newOrder,
      discountApplied: shouldApplyDiscount,
      originalTotal: totalAmount,
      finalTotal: finalTotalAmount,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name phone email")
      .populate("createdBy", "name email role")
      .populate("items.productId", "productName productCode price");
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single order
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("createdBy", "name email role")
      .populate("items.productId", "productName productCode price");
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate order ID format
    if (!req.params.id || req.params.id.length !== 24) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order ID format" });
    }

    const order = await Order.findById(req.params.id);

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const oldStatus = order.status;
    order.status = status || order.status;

    // Handle stock management based on status change
    if (status === "completed" && oldStatus !== "completed") {
      // Deduct stock from products when order is completed
      for (const item of order.items) {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            // Validate stock before deduction
            if (product.reservedStock < item.quantity) {
              console.error(
                `❌ Insufficient reserved stock for ${product.productName}`
              );
              continue;
            }

            product.stockQuantity -= item.quantity;
            product.reservedStock -= item.quantity;
            await product.save();
            console.log(
              `✅ Stock deducted for ${product.productName}: ${item.quantity}`
            );
          } else {
            console.error(`❌ Product not found: ${item.productId}`);
          }
        } catch (stockError) {
          console.error(
            `❌ Stock update error for product ${item.productId}:`,
            stockError
          );
        }
      }

      // Create ledger entries for completed order
      try {
        // Determine payment type (you can modify this logic based on your business rules)
        const paymentType = "Cash"; // Default to cash, you can get this from order data

        await createSalesLedgerEntry(
          order._id,
          order.customer,
          order.totalAmount,
          paymentType
        );
        console.log(`✅ Ledger entries created for order: ${order._id}`);
      } catch (ledgerError) {
        console.error(`❌ Ledger entry creation error:`, ledgerError);
        // Don't fail the order completion if ledger entry fails
      }
    } else if (status === "cancelled" && oldStatus !== "cancelled") {
      // Restore reserved stock when order is cancelled
      for (const item of order.items) {
        try {
          const product = await Product.findById(item.productId);
          if (product) {
            // Validate reserved stock before restoration
            if (product.reservedStock < item.quantity) {
              console.error(
                `❌ Insufficient reserved stock for ${product.productName}`
              );
              continue;
            }

            product.reservedStock -= item.quantity;
            await product.save();
            console.log(
              `✅ Reserved stock restored for ${product.productName}: ${item.quantity}`
            );
          } else {
            console.error(`❌ Product not found: ${item.productId}`);
          }
        } catch (stockError) {
          console.error(
            `❌ Stock restoration error for product ${item.productId}:`,
            stockError
          );
        }
      }
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${order.status}`,
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
