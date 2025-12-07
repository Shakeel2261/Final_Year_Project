import express from "express";
import {
  createLedgerEntry,
  getLedgerEntries,
  getLedgerEntryById,
  updateLedgerEntry,
  deleteLedgerEntry,
  getAccountBalance,
  getTrialBalance,
  getProfitLossStatement,
  getBalanceSheet,
} from "../controllers/ledgerController.js";

const router = express.Router();

// Create ledger entry
router.post("/", createLedgerEntry);

// Get all ledger entries with filters
router.get("/", getLedgerEntries);

// Get single ledger entry
router.get("/:id", getLedgerEntryById);

// Update ledger entry
router.put("/:id", updateLedgerEntry);

// Delete ledger entry (soft delete)
router.delete("/:id", deleteLedgerEntry);

// Get account balance
router.get("/account/balance", getAccountBalance);

// Get trial balance
router.get("/reports/trial-balance", getTrialBalance);

// Get profit & loss statement
router.get("/reports/profit-loss", getProfitLossStatement);

// Get balance sheet
router.get("/reports/balance-sheet", getBalanceSheet);

export default router;


