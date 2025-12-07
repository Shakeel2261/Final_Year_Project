import express from "express";
import {
  getSalesReport,
  getPurchaseReport,
  getDashboardSummary,
  getRevenueReport,
} from "../controllers/reportsController.js";

const router = express.Router();

// GET /api/reports/sales - Get sales report (weekly data for 12 weeks)
router.get("/sales", getSalesReport);

// GET /api/reports/purchases - Get purchase report (weekly data for 12 weeks)
router.get("/purchases", getPurchaseReport);

// GET /api/reports/dashboard - Get dashboard summary with today's stats
router.get("/dashboard", getDashboardSummary);

// GET /api/reports/revenue - Get monthly revenue report
router.get("/revenue", getRevenueReport);

export default router;




