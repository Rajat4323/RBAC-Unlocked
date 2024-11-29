const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];


  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded; // Attach the decoded payload to req.user
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    return res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

module.exports = authenticateToken;
