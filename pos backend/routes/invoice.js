import express from "express";
import {
  generateInvoice,
  getInvoices,
  getInvoiceById,
  getInvoicesByTransaction,
  getInvoicesByCustomer,
  updateInvoicePayment,
  deleteInvoice,
  getInvoiceSummary,
  downloadInvoicePDF,
} from "../controllers/invoiceController.js";

const router = express.Router();

// Generate invoice for a transaction
router.post("/generate/:transactionId", generateInvoice);

// Get all invoices with filters
router.get("/", getInvoices);

// Get invoice summary/statistics
router.get("/summary", getInvoiceSummary);

// Get single invoice
router.get("/:id", getInvoiceById);

// Download invoice PDF
router.get("/:id/download", downloadInvoicePDF);

// Get invoices by transaction
router.get("/transaction/:transactionId", getInvoicesByTransaction);

// Get invoices by customer
router.get("/customer/:customerId", getInvoicesByCustomer);

// Update payment on invoice
router.put("/:id/payment", updateInvoicePayment);

// Delete invoice (soft delete)
router.delete("/:id", deleteInvoice);

export default router;
