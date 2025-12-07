import Transaction from "../models/transaction.js";
import { createPaymentReceivedEntry } from "./ledgerController.js";
import { generateInvoice } from "./invoiceController.js";

// Create transaction
export const createTransaction = async (req, res) => {
  try {
    const { customer, amount, type, status, order, notes } = req.body;

    // If status is provided, use it; otherwise, set default based on type
    let transactionStatus = status;
    if (!status) {
      transactionStatus = type === "Cash" ? "Paid" : "Pending";
    }

    const transaction = await Transaction.create({
      customer,
      amount,
      type,
      status: transactionStatus,
      order,
      notes,
    });

    // Auto-generate invoice for the transaction
    try {
      const invoiceReq = {
        params: { transactionId: transaction._id },
        body: { notes: notes },
        user: req.user,
      };
      const invoiceRes = {
        status: () => ({ json: () => {} }),
        json: () => {},
      };

      await generateInvoice(invoiceReq, invoiceRes);
      console.log(`✅ Invoice generated for transaction: ${transaction._id}`);
    } catch (invoiceError) {
      console.error(`❌ Invoice generation error:`, invoiceError);
      // Don't fail the transaction if invoice generation fails
    }

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("customer order");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get receivables (only credit & pending)
export const getReceivables = async (req, res) => {
  try {
    const receivables = await Transaction.find({
      type: "Credit",
      status: "Pending",
    }).populate("customer order");

    res.status(200).json(receivables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Pay a receivable (mark as Paid)
export const payReceivable = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.status === "Paid") {
      return res.status(400).json({ message: "Transaction already paid" });
    }

    transaction.status = "Paid";
    await transaction.save();

    // Create ledger entries for payment received
    try {
      await createPaymentReceivedEntry(
        transaction._id,
        transaction.customer,
        transaction.amount
      );
      console.log(`✅ Ledger entries created for payment: ${transaction._id}`);
    } catch (ledgerError) {
      console.error(`❌ Ledger entry creation error:`, ledgerError);
      // Don't fail the payment if ledger entry fails
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
