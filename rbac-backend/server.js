const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors package
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/admin");
const app = express();
require("dotenv").config();

// Enable CORS for all origins (you can specify a particular origin if needed)
app.use(cors());

// Middleware to parse incoming JSON
app.use(express.json());

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_DB_URI
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
