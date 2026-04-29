const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Basic health check
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Routes
const userRoutes = require("./routes/userRoutes");
const clothesRoutes = require("./routes/clothesRoutes");
const swapRequestRoutes = require("./routes/swapRequestRoutes");

app.use("/api/users", userRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/swapRequests", swapRequestRoutes);

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
