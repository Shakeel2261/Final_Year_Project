import express from "express";
import {
  createTransaction,
  getTransactions,
  getReceivables,
  payReceivable,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction);         // Create transaction
router.get("/", getTransactions);            // Get all transactions
router.get("/receivables", getReceivables);  // Get only pending credit transactions
router.put("/pay/:id", payReceivable);       // Mark receivable as paid
router.delete("/:id", deleteTransaction);    // Delete transaction

export default router;
