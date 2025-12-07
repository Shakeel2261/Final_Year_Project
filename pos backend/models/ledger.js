import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    // Transaction Details
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      required: false, // Optional for manual entries
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false, // Optional for manual entries
    },

    // Entry Type
    entryType: {
      type: String,
      enum: [
        "SALE",
        "PURCHASE",
        "PAYMENT_RECEIVED",
        "PAYMENT_MADE",
        "EXPENSE",
        "INCOME",
        "ADJUSTMENT",
      ],
      required: true,
    },

    // Debit/Credit Entry
    debitAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    creditAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Account Categories
    accountType: {
      type: String,
      enum: ["ASSETS", "LIABILITIES", "EQUITY", "REVENUE", "EXPENSES"],
      required: true,
    },

    // Specific Account
    accountName: {
      type: String,
      enum: [
        // Assets
        "CASH",
        "BANK",
        "INVENTORY",
        "ACCOUNTS_RECEIVABLE",
        "EQUIPMENT",
        // Liabilities
        "ACCOUNTS_PAYABLE",
        "LOANS_PAYABLE",
        "SALARIES_PAYABLE",
        // Equity
        "OWNER_EQUITY",
        "RETAINED_EARNINGS",
        // Revenue
        "SALES_REVENUE",
        "OTHER_INCOME",
        // Expenses
        "COST_OF_GOODS_SOLD",
        "RENT_EXPENSE",
        "UTILITIES_EXPENSE",
        "SALARIES_EXPENSE",
        "ADVERTISING_EXPENSE",
        "OTHER_EXPENSES",
      ],
      required: true,
    },

    // Customer/Supplier Info
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },

    // Description
    description: {
      type: String,
      required: true,
    },

    // Reference Number
    referenceNumber: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },

    // Date
    transactionDate: {
      type: Date,
      default: Date.now,
    },

    // Status
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED", "ADJUSTED"],
      default: "ACTIVE",
    },

    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    // Notes
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    // Ensure that debitAmount and creditAmount are not both zero
    validate: {
      validator: function () {
        return this.debitAmount > 0 || this.creditAmount > 0;
      },
      message: "Either debitAmount or creditAmount must be greater than 0",
    },
  }
);

// Indexes for better performance
ledgerSchema.index({ transactionDate: -1 });
ledgerSchema.index({ accountName: 1 });
ledgerSchema.index({ entryType: 1 });
ledgerSchema.index({ customer: 1 });

// Virtual for balance (debit - credit)
ledgerSchema.virtual("balance").get(function () {
  return this.debitAmount - this.creditAmount;
});

// Static method to get account balance
ledgerSchema.statics.getAccountBalance = async function (
  accountName,
  fromDate = null,
  toDate = null
) {
  const query = { accountName, status: "ACTIVE" };

  if (fromDate && toDate) {
    query.transactionDate = { $gte: fromDate, $lte: toDate };
  }

  const result = await this.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        totalDebit: { $sum: "$debitAmount" },
        totalCredit: { $sum: "$creditAmount" },
        balance: { $sum: { $subtract: ["$debitAmount", "$creditAmount"] } },
      },
    },
  ]);

  return result.length > 0
    ? result[0]
    : { totalDebit: 0, totalCredit: 0, balance: 0 };
};

// Static method to get trial balance
ledgerSchema.statics.getTrialBalance = async function (
  fromDate = null,
  toDate = null
) {
  const query = { status: "ACTIVE" };

  if (fromDate && toDate) {
    query.transactionDate = { $gte: fromDate, $lte: toDate };
  }

  const result = await this.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$accountName",
        accountType: { $first: "$accountType" },
        totalDebit: { $sum: "$debitAmount" },
        totalCredit: { $sum: "$creditAmount" },
        balance: { $sum: { $subtract: ["$debitAmount", "$creditAmount"] } },
      },
    },
    { $sort: { accountType: 1, _id: 1 } },
  ]);

  return result;
};

const Ledger = mongoose.model("Ledger", ledgerSchema);

export default Ledger;
