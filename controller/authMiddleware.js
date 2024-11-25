const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "Token is required!" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Menyimpan ID user ke request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token!" });
  }
};
