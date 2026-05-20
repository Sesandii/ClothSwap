// backend/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("authorization");
  const token = req.header("x-auth-token") || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null);

  // If no token exists, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role && decoded.role !== "user") {
      return res.status(403).json({ message: "User access required" });
    }

    req.user = decoded.userId; // Attach userId from the token to request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
