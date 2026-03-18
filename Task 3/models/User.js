// models/User.js
// This file defines the User class with register and login methods

const mongoose = require("mongoose");

// --- Mongoose Schema ---
// This tells MongoDB what each user document looks like
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // No two users can have the same username
  },
  password: {
    type: String,
    required: true,
  },
});

// Create the Mongoose model (maps to "users" collection in studentDB)
const UserModel = mongoose.model("User", userSchema);

// --- User Class ---
class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // register() - saves a new user to MongoDB
  async register() {
    // Check if username already exists
    const existing = await UserModel.findOne({ username: this.username });
    if (existing) {
      throw new Error("Username already taken");
    }

    // Create and save the new user
    // NOTE: Password is stored as plain text (kept simple for beginners)
    const newUser = new UserModel({
      username: this.username,
      password: this.password,
    });

    await newUser.save();
    return "User registered successfully";
  }

  // login() - checks if user exists and password matches
  async login() {
    // Find the user in the database
    const foundUser = await UserModel.findOne({ username: this.username });

    if (!foundUser) {
      throw new Error("User not found");
    }

    // Check if the password matches
    if (foundUser.password !== this.password) {
      throw new Error("Incorrect password");
    }

    return "Login successful";
  }
}

module.exports = User;
