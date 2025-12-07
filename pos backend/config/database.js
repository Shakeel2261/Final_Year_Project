// config/database.js
import mongoose from "mongoose";

const connectDB = async () => {
  const url = process.env.MONGO_URI || "mongodb://localhost:27017/point_of_sale";

  try {
    // Mongoose 6+ doesn't require options but no harm including them
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop the process if DB connection fails
  }
};

export default connectDB;
