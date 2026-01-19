// routes/index.js
import express from "express";
import productRoutes from "./products.js"; // make sure path and filename match
import authRoutes from "./user.js";
import customerAuthRoutes from "./customerAuth.js";
import orderRoutes from "./order.js";
import customerRoutes from "./customer.js";
<<<<<<< HEAD
import CategoryRoutes from "./category.js";
=======
import CategoryRoutes from "./Category.js";
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
import transactionRoutes from "./transaction.js";
import reportsRoutes from "./reports.js";
import ledgerRoutes from "./ledger.js";
import invoiceRoutes from "./invoice.js";
<<<<<<< HEAD
import stripeRoutes from "./stripe.js";
=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab

const router = express.Router();

// mount product routes at /api/products
router.use("/products", productRoutes);
router.use("/auth", authRoutes); // ⬅️ mount admin auth under /api/auth
router.use("/customer-auth", customerAuthRoutes); // ⬅️ mount customer auth under /api/customer-auth
router.use("/orders", orderRoutes); // ⬅️ mount orders under /api/orders
router.use("/customers", customerRoutes); // ⬅️ mount customers under /api/customers
router.use("/categories", CategoryRoutes); // ⬅️ mount categories under /api/categories
router.use("/transactions", transactionRoutes); // ⬅️ mount transactions under /api/transactions
router.use("/reports", reportsRoutes); // ⬅️ mount reports under /api/reports
router.use("/ledger", ledgerRoutes); // ⬅️ mount ledger under /api/ledger
router.use("/invoices", invoiceRoutes); // ⬅️ mount invoices under /api/invoices
<<<<<<< HEAD
router.use("/stripe", stripeRoutes); // ⬅️ mount Stripe routes under /api/stripe
=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab

export default router;
