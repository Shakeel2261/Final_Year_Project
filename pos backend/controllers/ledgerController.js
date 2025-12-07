import Ledger from "../models/ledger.js";
import Transaction from "../models/transaction.js";
import Order from "../models/order.js";

// Create Ledger Entry
export const createLedgerEntry = async (req, res) => {
  try {
    const {
      entryType,
      debitAmount,
      creditAmount,
      accountType,
      accountName,
      customer,
      description,
      referenceNumber,
      transactionDate,
      notes,
    } = req.body;

    // Validate required fields
    if (!entryType || !accountType || !accountName || !description) {
      return res.status(400).json({
        message:
          "Missing required fields: entryType, accountType, accountName, and description are required",
      });
    }

    // Validate debit/credit amounts
    if ((debitAmount || 0) <= 0 && (creditAmount || 0) <= 0) {
      return res.status(400).json({
        message: "Either debitAmount or creditAmount must be greater than 0",
      });
    }

    // Generate reference number if not provided
    let refNumber = referenceNumber;
    if (!refNumber) {
      const count = await Ledger.countDocuments();
      refNumber = `LED-${String(count + 1).padStart(6, "0")}`;
    }

    const ledgerEntry = new Ledger({
      entryType,
      debitAmount: debitAmount || 0,
      creditAmount: creditAmount || 0,
      accountType,
      accountName,
      customer,
      description,
      referenceNumber: refNumber,
      transactionDate: transactionDate || new Date(),
      notes,
      createdBy: req.user?.id, // Assuming user is available in req
    });

    await ledgerEntry.save();

    res.status(201).json({
      success: true,
      message: "Ledger entry created successfully",
      data: ledgerEntry,
    });
  } catch (error) {
    console.error("Error creating ledger entry:", error);
    res.status(400).json({
      message: error.message,
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Get All Ledger Entries
export const getLedgerEntries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      accountName,
      entryType,
      fromDate,
      toDate,
      status = "ACTIVE",
    } = req.query;

    const query = { status };

    // Add filters
    if (accountName) query.accountName = accountName;
    if (entryType) query.entryType = entryType;
    if (fromDate && toDate) {
      query.transactionDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const skip = (page - 1) * limit;

    const entries = await Ledger.find(query)
      .populate("customer", "name phone")
      .populate("transactionId")
      .populate("orderId")
      .populate("createdBy", "name")
      .sort({ transactionDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Ledger.countDocuments(query);

    res.json({
      success: true,
      totalRecords: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: entries,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Ledger Entry
export const getLedgerEntryById = async (req, res) => {
  try {
    const entry = await Ledger.findById(req.params.id)
      .populate("customer", "name phone")
      .populate("transactionId")
      .populate("orderId")
      .populate("createdBy", "name");

    if (!entry) {
      return res.status(404).json({ message: "Ledger entry not found" });
    }

    res.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Ledger Entry
export const updateLedgerEntry = async (req, res) => {
  try {
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const updatedEntry = await Ledger.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Ledger entry not found" });
    }

    res.json({
      success: true,
      message: "Ledger entry updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Ledger Entry (Soft delete by changing status)
export const deleteLedgerEntry = async (req, res) => {
  try {
    const entry = await Ledger.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Ledger entry not found" });
    }

    // Soft delete by changing status
    entry.status = "CANCELLED";
    await entry.save();

    res.json({
      success: true,
      message: "Ledger entry cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Account Balance
export const getAccountBalance = async (req, res) => {
  try {
    const { accountName, fromDate, toDate } = req.query;

    if (!accountName) {
      return res.status(400).json({
        message: "Account name is required",
      });
    }

    const balance = await Ledger.getAccountBalance(
      accountName,
      fromDate ? new Date(fromDate) : null,
      toDate ? new Date(toDate) : null
    );

    res.json({
      success: true,
      data: {
        accountName,
        ...balance,
        dateRange: {
          from: fromDate || null,
          to: toDate || null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Trial Balance
export const getTrialBalance = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const trialBalance = await Ledger.getTrialBalance(
      fromDate ? new Date(fromDate) : null,
      toDate ? new Date(toDate) : null
    );

    // Calculate totals
    const totalDebit = trialBalance.reduce(
      (sum, account) => sum + account.totalDebit,
      0
    );
    const totalCredit = trialBalance.reduce(
      (sum, account) => sum + account.totalCredit,
      0
    );

    res.json({
      success: true,
      data: {
        accounts: trialBalance,
        totals: {
          totalDebit,
          totalCredit,
          difference: totalDebit - totalCredit,
        },
        dateRange: {
          from: fromDate || null,
          to: toDate || null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Profit & Loss Statement
export const getProfitLossStatement = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const query = { status: "ACTIVE" };
    if (fromDate && toDate) {
      query.transactionDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Get Revenue accounts
    const revenueAccounts = await Ledger.aggregate([
      { $match: { ...query, accountType: "REVENUE" } },
      {
        $group: {
          _id: "$accountName",
          totalCredit: { $sum: "$creditAmount" },
          totalDebit: { $sum: "$debitAmount" },
        },
      },
    ]);

    // Get Expense accounts
    const expenseAccounts = await Ledger.aggregate([
      { $match: { ...query, accountType: "EXPENSES" } },
      {
        $group: {
          _id: "$accountName",
          totalCredit: { $sum: "$creditAmount" },
          totalDebit: { $sum: "$debitAmount" },
        },
      },
    ]);

    // Calculate totals
    const totalRevenue = revenueAccounts.reduce(
      (sum, account) => sum + account.totalCredit - account.totalDebit,
      0
    );
    const totalExpenses = expenseAccounts.reduce(
      (sum, account) => sum + account.totalDebit - account.totalCredit,
      0
    );
    const netProfit = totalRevenue - totalExpenses;

    res.json({
      success: true,
      data: {
        revenue: {
          accounts: revenueAccounts,
          total: totalRevenue,
        },
        expenses: {
          accounts: expenseAccounts,
          total: totalExpenses,
        },
        netProfit,
        dateRange: {
          from: fromDate || null,
          to: toDate || null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Balance Sheet
export const getBalanceSheet = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const query = { status: "ACTIVE" };
    if (fromDate && toDate) {
      query.transactionDate = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    // Get Assets
    const assets = await Ledger.aggregate([
      { $match: { ...query, accountType: "ASSETS" } },
      {
        $group: {
          _id: "$accountName",
          totalDebit: { $sum: "$debitAmount" },
          totalCredit: { $sum: "$creditAmount" },
        },
      },
    ]);

    // Get Liabilities
    const liabilities = await Ledger.aggregate([
      { $match: { ...query, accountType: "LIABILITIES" } },
      {
        $group: {
          _id: "$accountName",
          totalDebit: { $sum: "$debitAmount" },
          totalCredit: { $sum: "$creditAmount" },
        },
      },
    ]);

    // Get Equity
    const equity = await Ledger.aggregate([
      { $match: { ...query, accountType: "EQUITY" } },
      {
        $group: {
          _id: "$accountName",
          totalDebit: { $sum: "$debitAmount" },
          totalCredit: { $sum: "$creditAmount" },
        },
      },
    ]);

    // Calculate totals
    const totalAssets = assets.reduce(
      (sum, account) => sum + account.totalDebit - account.totalCredit,
      0
    );
    const totalLiabilities = liabilities.reduce(
      (sum, account) => sum + account.totalCredit - account.totalDebit,
      0
    );
    const totalEquity = equity.reduce(
      (sum, account) => sum + account.totalCredit - account.totalDebit,
      0
    );

    res.json({
      success: true,
      data: {
        assets: {
          accounts: assets,
          total: totalAssets,
        },
        liabilities: {
          accounts: liabilities,
          total: totalLiabilities,
        },
        equity: {
          accounts: equity,
          total: totalEquity,
        },
        balance: totalAssets - (totalLiabilities + totalEquity),
        dateRange: {
          from: fromDate || null,
          to: toDate || null,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auto-create ledger entries from sales
export const createSalesLedgerEntry = async (
  orderId,
  customerId,
  totalAmount,
  paymentType
) => {
  try {
    const entries = [];

    // 1. Debit: Accounts Receivable (if credit) or Cash (if cash)
    if (paymentType === "Credit") {
      entries.push({
        orderId,
        customer: customerId,
        entryType: "SALE",
        debitAmount: totalAmount,
        creditAmount: 0,
        accountType: "ASSETS",
        accountName: "ACCOUNTS_RECEIVABLE",
        description: `Sale to customer - Order #${orderId}`,
        transactionDate: new Date(),
      });
    } else {
      entries.push({
        orderId,
        customer: customerId,
        entryType: "SALE",
        debitAmount: totalAmount,
        creditAmount: 0,
        accountType: "ASSETS",
        accountName: "CASH",
        description: `Cash sale - Order #${orderId}`,
        transactionDate: new Date(),
      });
    }

    // 2. Credit: Sales Revenue
    entries.push({
      orderId,
      customer: customerId,
      entryType: "SALE",
      debitAmount: 0,
      creditAmount: totalAmount,
      accountType: "REVENUE",
      accountName: "SALES_REVENUE",
      description: `Sales revenue - Order #${orderId}`,
      transactionDate: new Date(),
    });

    // Create all entries
    const createdEntries = await Ledger.insertMany(entries);
    return createdEntries;
  } catch (error) {
    console.error("Error creating sales ledger entries:", error);
    throw error;
  }
};

// Auto-create ledger entries for payment received
export const createPaymentReceivedEntry = async (
  transactionId,
  customerId,
  amount
) => {
  try {
    const entries = [];

    // 1. Debit: Cash
    entries.push({
      transactionId,
      customer: customerId,
      entryType: "PAYMENT_RECEIVED",
      debitAmount: amount,
      creditAmount: 0,
      accountType: "ASSETS",
      accountName: "CASH",
      description: `Payment received from customer`,
      transactionDate: new Date(),
    });

    // 2. Credit: Accounts Receivable
    entries.push({
      transactionId,
      customer: customerId,
      entryType: "PAYMENT_RECEIVED",
      debitAmount: 0,
      creditAmount: amount,
      accountType: "ASSETS",
      accountName: "ACCOUNTS_RECEIVABLE",
      description: `Payment received from customer`,
      transactionDate: new Date(),
    });

    const createdEntries = await Ledger.insertMany(entries);
    return createdEntries;
  } catch (error) {
    console.error("Error creating payment received entries:", error);
    throw error;
  }
};


