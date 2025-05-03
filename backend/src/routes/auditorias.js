const express = require("express");
const router = express.Router();
const {
  listarPlanificacion,
  agregarPlanificacion,
  actualizarPlanificacion,
  eliminarPlanificacion,
  listarAuditorias,
  agregarAuditoria,
  actualizarAuditoria,
  eliminarAuditoria,
  getChecklist,
  toggleChecklistItem,
  listarHallazgos,
  crearHallazgo,
  listarAcciones,
  crearAccion,
  actualizarAccion,
  eliminarAccion,
  getEstadisticas,
  getInformeDetalle,
  // Admin controllers:
  listarTipos,
  crearTipo,
  updateTipo,
  deleteTipo,
  listarRoles,
  crearRole,
  updateRole,
  deleteRole,
  listarChecklistMaster,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  listarPlantillasAdmin,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  listarNotificacionesConfig,
  updateNotificacionesConfig,
  listarParametros,
  updateParametros
} = require("../controllers/auditoriasController");
const { verifyToken } = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// Todas las rutas protegidas
router.use(verifyToken);

// Planificación
router.get("/planificacion", listarPlanificacion);
router.post("/planificacion", agregarPlanificacion);
router.put("/planificacion/:id", actualizarPlanificacion);
router.delete("/planificacion/:id", eliminarPlanificacion);

// Ejecución
router.get("/", listarAuditorias);
router.post("/", agregarAuditoria);
router.put("/:id", actualizarAuditoria);
router.delete("/:id", eliminarAuditoria);

// Checklist
router.get("/:id/checklist", getChecklist);
router.put("/checklist/:itemId", toggleChecklistItem);

// Hallazgos
router.get("/:id/hallazgos", listarHallazgos);
router.post("/:id/hallazgos", upload.single("evidencia"), crearHallazgo);

// Acciones
router.get("/:id/acciones", listarAcciones);
router.post("/:id/acciones", crearAccion);
router.put("/:id/acciones/:accionId", actualizarAccion);
router.delete("/:id/acciones/:accionId", eliminarAccion);

// Informes / Reportes
router.get("/informes/estadisticas", getEstadisticas);
router.get("/informes/detalle",     getInformeDetalle);

// Administración (sub-router)
const admin = express.Router();

// Tipos
admin.get("/tipos",     listarTipos);
admin.post("/tipos",    crearTipo);
admin.put("/tipos/:id", updateTipo);
admin.delete("/tipos/:id", deleteTipo);

// Roles
admin.get("/roles",     listarRoles);
admin.post("/roles",    crearRole);
admin.put("/roles/:id", updateRole);
admin.delete("/roles/:id", deleteRole);

// Checklist master
admin.get("/checklist",           listarChecklistMaster);
admin.post("/checklist",          createChecklistItem);
admin.put("/checklist/:id",       updateChecklistItem);
admin.delete("/checklist/:id",    deleteChecklistItem);

// Plantillas auditoría
admin.get("/plantillas",           listarPlantillasAdmin);
admin.post("/plantillas",          createPlantilla);
admin.put("/plantillas/:id",       updatePlantilla);
admin.delete("/plantillas/:id",    deletePlantilla);

// Notificaciones
admin.get("/notificaciones",           listarNotificacionesConfig);
admin.put("/notificaciones/:id",       updateNotificacionesConfig);

// Parámetros
admin.get("/parametros",           listarParametros);
admin.put("/parametros/:id",       updateParametros);

// Montamos el sub-router en /admin
router.use("/admin", admin);

module.exports = router;
