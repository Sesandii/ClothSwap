const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Basic health check
app.get("/", (req, res) => {
  res.send("Backend Running");
});

// Routes
const userRoutes = require("./routes/userRoutes");
const clothesRoutes = require("./routes/clothesRoutes");
const swapRequestRoutes = require("./routes/swapRequestRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const messageRoutes = require("./routes/messageRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

app.use("/api/users", userRoutes);
app.use("/api/clothes", clothesRoutes);
app.use("/api/swapRequests", swapRequestRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/complaints", complaintRoutes);

app.use((err, req, res, next) => {
  if (err.type === "entity.too.large") {
    return res.status(413).json({
      message:
        "The uploaded images are too large. Please use smaller photos and try again.",
    });
  }

  return next(err);
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
