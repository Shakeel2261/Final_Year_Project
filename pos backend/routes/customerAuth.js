import express from "express";
import {
  customerLogin,
  customerForgotPassword,
  customerResetPassword,
} from "../controllers/customerController.js";

const router = express.Router();

router.post("/login", customerLogin); // Customer login
router.post("/forgot-password", customerForgotPassword); // Customer forgot password
router.post("/reset-password/:token", customerResetPassword); // Customer reset password

export default router;
