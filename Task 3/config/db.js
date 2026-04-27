

const mongoose = require("mongoose");


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
