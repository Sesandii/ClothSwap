const express = require("express");
const cors = require("cors");
const path = require("path");

if (!process.env.RENDER) {
  require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });
}

const connectDB = require("./config/db");

const app = express();

const normalizeOrigin = (origin) => {
  if (!origin) {
    return "";
  }

  try {
    return new URL(origin).origin;
  } catch {
    return origin.replace(/\/$/, "");
  }
};

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
  .filter(Boolean);

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    origin: (origin, callback) => {
      const requestOrigin = normalizeOrigin(origin);

      if (
        !requestOrigin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(requestOrigin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
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
  console.log("Startup config:", {
    nodeEnv: process.env.NODE_ENV || "unset",
    render: process.env.RENDER || "false",
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL || process.env.MONGO_URI),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    clientUrl: process.env.CLIENT_URL || "unset",
  });

  if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables.");
  }

  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
