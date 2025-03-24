// backend/middlewares/authMiddleware.js
require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided." });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error("Error al verificar token:", err);
      return res.status(403).json({ error: "Token inválido o expirado." });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
