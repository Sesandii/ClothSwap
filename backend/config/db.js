const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.DATABASE_URL || process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error(
        "Missing MongoDB connection string. Set DATABASE_URL or MONGO_URI in backend/.env."
      );
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
