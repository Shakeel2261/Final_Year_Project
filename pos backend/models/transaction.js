import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Cash", "Credit"], // Cash = paid instantly, Credit = udhar
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"], // Pending = not cleared (receivable), Paid = cleared
      default: "Pending",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
