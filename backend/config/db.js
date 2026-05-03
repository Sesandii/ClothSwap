const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.DATABASE_URL || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "Missing MongoDB connection string. Set DATABASE_URL or MONGO_URI in Render environment variables."
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

module.exports = connectDB;
