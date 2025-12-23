import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
} from "../controllers/stripeController.js";

const router = express.Router();

// POST /api/stripe/create-payment-intent - Create a payment intent
router.post("/create-payment-intent", createPaymentIntent);

// POST /api/stripe/confirm-payment - Confirm a payment
router.post("/confirm-payment", confirmPayment);

// GET /api/stripe/payment-status/:paymentIntentId - Get payment status
router.get("/payment-status/:paymentIntentId", getPaymentStatus);

export default router;
