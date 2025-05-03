// backend/server.js
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');
const path       = require('path');

const app = express();

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir directorios estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Importar routers
const usuariosRoutes       = require(path.join(__dirname, 'src', 'routes', 'usuarios'));
const empresasRoutes       = require(path.join(__dirname, 'src', 'routes', 'empresas'));
const empleadosRoutes      = require(path.join(__dirname, 'src', 'routes', 'empleados'));
const empleadosDocsRoutes  = require(path.join(__dirname, 'src', 'routes', 'empleadosDocumentos'));
const plantillasRoutes     = require(path.join(__dirname, 'src', 'routes', 'plantillas'));
const documentosRoutes     = require(path.join(__dirname, 'src', 'routes', 'documentos'));
const reportesRoutes       = require(path.join(__dirname, 'src', 'routes', 'reportes'));
const auditoriasRoutes     = require(path.join(__dirname, 'src', 'routes', 'auditorias'));
const capacitacionesRoutes = require(path.join(__dirname, 'src', 'routes', 'capacitaciones'));
const presupuestoRoutes    = require(path.join(__dirname, 'src', 'routes', 'presupuesto'));
const formulariosRoutes    = require(path.join(__dirname, 'src', 'routes', 'formularios'));

// Debug: confirma que los routers existen
console.log('=> Montando rutas de la API:');
console.log('   /api/usuarios           ->', !!usuariosRoutes);
console.log('   /api/empresas           ->', !!empresasRoutes);
console.log('   /api/empleados          ->', !!empleadosRoutes);
console.log('   /api/empleados/documentos ->', !!empleadosDocsRoutes);
console.log('   /api/plantillas         ->', !!plantillasRoutes);
console.log('   /api/documentos         ->', !!documentosRoutes);
console.log('   /api/reportes           ->', !!reportesRoutes);
console.log('   /api/auditorias         ->', !!auditoriasRoutes);
console.log('   /api/capacitaciones     ->', !!capacitacionesRoutes);
console.log('   /api/presupuesto        ->', !!presupuestoRoutes);
console.log('   /api/formularios        ->', !!formulariosRoutes);

// Montar rutas de la API
app.use('/api/usuarios',             usuariosRoutes);
app.use('/api/empresas',             empresasRoutes);
app.use('/api/empleados',            empleadosRoutes);
app.use('/api/empleados/documentos', empleadosDocsRoutes);
app.use('/api/plantillas',           plantillasRoutes);
app.use('/api/documentos',           documentosRoutes);
app.use('/api/reportes',             reportesRoutes);
app.use('/api/auditorias',           auditoriasRoutes);
app.use('/api/capacitaciones',       capacitacionesRoutes);
app.use('/api/presupuesto',          presupuestoRoutes);
app.use('/api/formularios',          formulariosRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Backend en funcionamiento');
});

// Opcional: para SPAs, servir index.html en cualquier otra ruta
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
