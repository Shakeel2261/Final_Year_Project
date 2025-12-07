import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      // required: true,
      unique: true,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    originalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Paid", "Partial", "Outstanding"],
      default: "Outstanding",
    },
    type: {
      type: String,
      enum: ["Sales", "Payment", "Credit", "Receipt"],
      default: "Sales",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Credit", "Bank Transfer", "Cheque"],
      required: true,
    },
    dueDate: {
      type: Date,
    },
    pdfPath: {
      type: String,
    },
    notes: {
      type: String,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        productName: String,
        quantity: Number,
        unitPrice: Number,
        totalPrice: Number,
      },
    ],
    taxAmount: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice number
invoiceSchema.pre("save", async function (next) {
  if (this.isNew && !this.invoiceNumber) {
    const count = await this.constructor.countDocuments();
    this.invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Update remaining amount when paid amount changes
invoiceSchema.pre("save", function (next) {
  this.remainingAmount = this.originalAmount - this.paidAmount;

  // Update status based on payment
  if (this.remainingAmount <= 0) {
    this.status = "Paid";
  } else if (this.paidAmount > 0) {
    this.status = "Partial";
  } else {
    this.status = "Outstanding";
  }

  next();
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
