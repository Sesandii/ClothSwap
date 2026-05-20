const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  const authHeader = req.header("authorization");
  const token =
    req.header("x-auth-token") ||
    (authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null);

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = adminMiddleware;
