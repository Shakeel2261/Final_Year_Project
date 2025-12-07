import Customer from "../models/customer.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Create new customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const customer = await Customer.create({ name, email, phone, password });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select("-password");
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update customer
export const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const customer = await Customer.findById(req.params.id);

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    customer.name = name || customer.name;
    customer.email = email || customer.email;
    customer.phone = phone || customer.phone;

    if (password) customer.password = password;

    await customer.save();
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Customer Login
export const customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: customer._id, email: customer.email, type: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Customer login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Customer Forgot Password
export const customerForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await Customer.findOne({ email });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    customer.resetPasswordToken = resetToken;
    customer.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 min
    await customer.save();

    // In production, send this token via email
    res.json({
      message: "Password reset token generated",
      resetToken,
    });
  } catch (error) {
    console.error("Customer forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Customer Reset Password
export const customerResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const customer = await Customer.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!customer) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    customer.password = newPassword;
    customer.resetPasswordToken = undefined;
    customer.resetPasswordExpire = undefined;
    await customer.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Customer reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
