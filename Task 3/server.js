// server.js
// Main server file - starts the Express app and defines all routes

const express = require("express");
const session = require("express-session");

const connectDB = require("./config/db");
const User = require("./models/User");
const isLoggedIn = require("./middleware/auth");

const app = express();

// --- Connect to MongoDB ---
connectDB();

// --- Middleware Setup ---

// Parse incoming JSON data (so we can read req.body)
app.use(express.json());

// Parse URL-encoded data (for HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// Session setup - keeps users logged in between requests
app.use(
  session({
    secret: "mySecretKey123", // Used to sign the session cookie (keep this private)
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // Session lasts 1 hour
  })
);

// =======================================
// ROUTES
// =======================================

// --- Home Route ---
app.get("/", (req, res) => {
  res.send("Login System is running! Use /register, /login, /dashboard, /logout");
});

// --- Register Route ---
// POST /register
// Creates a new user account
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Create a new User instance and call register()
    const user = new User(username, password);
    const message = await user.register();
    res.status(201).send(message); // "User registered successfully"
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// --- Login Route ---
// POST /login
// Checks credentials and creates a session
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Create a User instance and call login()
    const user = new User(username, password);
    const message = await user.login();

    // Save the username in the session
    req.session.user = username;

    res.send(message); // "Login successful"
  } catch (error) {
    res.status(401).send(error.message);
  }
});

// --- Dashboard Route (Protected) ---
// GET /dashboard
// Only accessible to logged-in users
app.get("/dashboard", isLoggedIn, (req, res) => {
  // req.session.user holds the logged-in username
  res.send(`Welcome ${req.session.user}`);
});

// --- Logout Route ---
// GET /logout
// Destroys the session and logs the user out
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out");
    }
    res.send("Logout successful");
  });
});

// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
