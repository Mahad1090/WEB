// middleware/auth.js
// This middleware protects routes that need login

const isLoggedIn = (req, res, next) => {
  // Check if a session exists for this user
  if (req.session && req.session.user) {
    // User is logged in - allow them to continue
    next();
  } else {
    // User is NOT logged in - block access
    res.status(401).send("Access denied. Please login first.");
  }
};

module.exports = isLoggedIn;
