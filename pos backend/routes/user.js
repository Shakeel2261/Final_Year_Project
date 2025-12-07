import express from "express";
import { signup, login, forgotPassword, resetPassword } from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signup); // Register
router.post("/login", login);   // Authenticate
router.post("/forgot-password", forgotPassword);       // Forgot password
router.post("/reset-password/:token", resetPassword); // Reset password using token

export default router;
