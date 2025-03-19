// backend/db.js
const sql = require('mssql');

const config = {
  user: "node_user",
  password: "root",
  server: "localhost", // e.g., localhost\\SQLEXPRESS
  database: "SinergiaSGI",
  options: {
    encrypt: false,                // Cambia a true si tu entorno lo requiere (por ejemplo, Azure)
    trustServerCertificate: true,  // Para desarrollo local
  },
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Conectado a SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Error de conexión a SQL Server:', err);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
