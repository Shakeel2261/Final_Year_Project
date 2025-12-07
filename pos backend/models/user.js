import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "counter person", "cashier"],
      default: "cashier",
    },
    // New fields for forgot/reset password
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
