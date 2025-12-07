import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: false, // Made optional for backward compatibility
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        finalPrice: {
          type: Number,
          required: false, // Made optional for backward compatibility
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // cashier/manager/admin who created the order
      required: false, // Made optional for backward compatibility
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
