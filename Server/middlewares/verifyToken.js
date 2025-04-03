const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  const secretKey = process.env.JWT_SECRET || "defaultsecret"; 
  try {
    const decoded = jwt.verify(token, secretKey);    
    req.user = decoded; 
    next(); 
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

module.exports = verifyToken;