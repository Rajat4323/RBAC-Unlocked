const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticateToken = require("../middleware/authenticateToken");
const router = express.Router();


// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password );
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during login" });
  }
});

// router.get("/auth/me", async (req, res) => {
//   try {
//     // Assuming `req.user` contains the authenticated user's info
//     console.log(req.user)
//     const user = await User.findById(req.user._id).select("username role category");
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     res.json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Failed to fetch user details" });
//   }
// }
router.get("/me", authenticateToken, async (req, res) => {
  try {
    //console.log("Authenticated user:", req.user); // Debugging log
    console.log(req);
    const user = await User.findById(req.user.id).select(
      "username role category"
    );

    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
}


);

module.exports = router;
