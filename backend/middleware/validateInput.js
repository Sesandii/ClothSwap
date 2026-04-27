// backend/middleware/validateInput.js

const validateUserInput = (req, res, next) => {
  const { name, email, password, phone, location } = req.body;
  
  // Simple validation for required fields
  if (!name || !email || !password || !phone || !location) {
    return res.status(400).json({ message: "All fields are required" });
  }

  next(); // If validation passes, continue to the next middleware or route
};

module.exports = validateUserInput;