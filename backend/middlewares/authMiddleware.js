// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1]; // Se asume el formato "Bearer <token>"
  jwt.verify(token, "tu_clave_secreta", (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: "Failed to authenticate token." });
    }
    // Verifica que decoded contenga la propiedad empresaID
    if (!decoded.empresaID) {
      return res.status(400).json({ error: "El token no contiene EmpresaID." });
    }
    req.user = decoded; // decoded contiene id, rol y empresaID
    next();
  });
};

module.exports = { verifyToken };
