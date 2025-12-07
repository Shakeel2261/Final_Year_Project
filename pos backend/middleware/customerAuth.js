import jwt from "jsonwebtoken";
import Customer from "../models/customer.js";

// Customer authentication middleware
export const customerAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token is for customer
    if (decoded.type !== "customer") {
      return res.status(401).json({ message: "Invalid token type" });
    }

    const customer = await Customer.findById(decoded.id).select("-password");

    if (!customer) {
      return res.status(401).json({ message: "Customer not found" });
    }

    req.customer = customer;
    next();
  } catch (error) {
    console.error("Customer auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
