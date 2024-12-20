const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Assuming you have a User model

const adminAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with your JWT_SECRET
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Attach user to request object for further use
    req.user = user;

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // Proceed to the next middleware or route handler if the user is an admin
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = adminAuth;
