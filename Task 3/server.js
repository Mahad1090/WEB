// server.js
// Main server file - starts the Express app and defines all routes

const express = require("express");
const session = require("express-session");
const path = require("path");

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

// Serve static frontend files from /public (disable default index.html on /)
app.use(express.static(path.join(__dirname, "public"), { index: false }));

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

// --- Page Routes ---
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.get("/dashboard", (req, res) => {
  if (req.session && req.session.user) {
    return res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  }
  res.redirect("/login");
});

// --- Health Route ---
app.get("/health", (req, res) => {
  res.send("Login System API is running");
});

// --- Register Route ---
// POST /api/register
// Creates a new user account
app.post("/api/register", async (req, res) => {
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
// POST /api/login
// Checks credentials and creates a session
app.post("/api/login", async (req, res) => {
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
// GET /api/dashboard
// Only accessible to logged-in users
app.get("/api/dashboard", isLoggedIn, (req, res) => {
  res.json({ message: `Welcome ${req.session.user}`, username: req.session.user });
});

// --- Logout Route ---
// GET /api/logout
// Destroys the session and logs the user out
app.get("/api/logout", (req, res) => {
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
