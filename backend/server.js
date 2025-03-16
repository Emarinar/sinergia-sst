// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Importar rutas existentes
const usuariosRoutes = require("./routes/usuarios");
const empresasRoutes = require("./routes/empresas");
const empleadosRoutes = require("./routes/empleados");
const documentosRoutes = require("./routes/documentos");
const reportesRoutes = require("./routes/reportes");
const auditoriasRoutes = require("./routes/auditorias");
const capacitacionesRoutes = require("./routes/capacitaciones");
const plantillasRoutes = require("./routes/plantillas");
// Importar la nueva ruta para documentos de empleados
const empleadosDocumentosRoutes = require("./routes/empleadosDocumentos");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use("/uploads", express.static("uploads"));

// Montar rutas de la API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/empresas", empresasRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/plantillas", plantillasRoutes);
// Nota: Si "empleadosRoutes" ya está montado en "/api/empleados",
// asegúrate de que la nueva ruta no genere conflicto. Puedes cambiar el prefijo, por ejemplo:
// app.use("/api/empleados", empleadosRoutes);
// app.use("/api/empleados", empleadosDocumentosRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/auditorias", auditoriasRoutes);
app.use("/api/capacitaciones", capacitacionesRoutes);
app.use("/api/empleados", empleadosDocumentosRoutes);

app.get("/", (req, res) => {
  res.send("Backend en funcionamiento");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
