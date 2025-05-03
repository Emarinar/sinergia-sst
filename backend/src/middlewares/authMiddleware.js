// backend/src/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "Bad format token" });

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token invalid" });
    req.user = decoded;
    next();
  });
}

module.exports = { verifyToken };
