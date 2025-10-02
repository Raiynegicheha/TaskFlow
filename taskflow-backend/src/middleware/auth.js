const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes - verify JWT token- only authenticated users can access
exports.protect = async (req, res, next) => {
  try {
    let token;
    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Get token part after 'Bearer '
    }

    // Make sure token exists
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token missing" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //decoded contains the payload we signed (user id)
      // Attach user to request object, excluding password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Not authorized, user not found" });
      }

      next(); // Proceed to next middleware or route handler
    } catch (err) {
      console.error("Token verification error:", err);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};


// Middleware to restrict access based on user roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res
            .status(403)
            .json({ success: false, message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next(); // User has one of the required roles, proceed
  };
}



// Middleware to check if user is admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // User is admin, proceed
  } else {
    res
      .status(403)
      .json({ success: false, message: "Forbidden: Admins only" });
  }
};
