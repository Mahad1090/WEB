// config/db.js
// This file connects our app to MongoDB

const mongoose = require("mongoose");

// Connect to MongoDB
// The database name is: studentDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/studentDB");
    console.log("Connected to MongoDB - studentDB");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1); // Stop the app if connection fails
  }
};

module.exports = connectDB;
