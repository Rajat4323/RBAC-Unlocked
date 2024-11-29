const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Get all users excluding admins
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }); // Exclude admins
    console.log('hello')
    console.log(users);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch users" });
  }
});

// Add a user
router.post("/users", async (req, res) => {
  const { username, password, role, quoteCategory } = req.body;

  // Basic validation
  if (!username || !password || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword, // Store the hashed password
      role,
      category: quoteCategory,
    });

    await newUser.save();
    res.json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create user" });
  }
});

// Edit a user
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { username, role, quoteCategory } = req.body;

  // Basic validation
  if (!username || !role) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, role, 
        category: quoteCategory },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update user" });
  }
});

// Delete a user
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete user" });
  }
});



module.exports = router;
