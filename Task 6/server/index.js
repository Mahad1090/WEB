const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true }
});

const Student = mongoose.model("Student", studentSchema);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching students", error: error.message });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { name, rollNumber } = req.body;

    if (!name || !rollNumber) {
      return res.status(400).json({ message: "Name and roll number are required" });
    }

    const student = await Student.create({ name, rollNumber });

    return res.status(201).json({
      message: "Signup saved successfully",
      student
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
