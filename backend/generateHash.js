const bcrypt = require('bcryptjs');

// Define la contraseña que deseas encriptar
const password = "admin123";

// Define el número de rondas para el salt (8 es un valor común para desarrollo)
const saltRounds = 8;

// Genera el hash de la contraseña
const hash = bcrypt.hashSync(password, saltRounds);

console.log("La contraseña:", password);
console.log("El hash generado:", hash);
