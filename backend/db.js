// db.js
const sql = require("mssql");

const config = {
  user: "node_user",
  password: "root",
  server: "localhost", // e.g., localhost\\SQLEXPRESS
  database: "SinergiaSGI",
  options: {
    encrypt: false, // O true si usas Azure
    trustServerCertificate: true,
  },
};

sql.connect(config, (err) => {
  if (err) {
    console.error("Error de conexión a SQL Server:", err);
  } else {
    console.log("Conectado a SQL Server");
  }
});

module.exports = sql;
