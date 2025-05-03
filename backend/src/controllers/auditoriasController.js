const { poolPromise } = require('../../db');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 1. Planificación de auditorías
async function listarPlanificacion(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT * FROM PlanificacionAuditorias ORDER BY CreatedAt DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar planificación:", err);
    res.status(500).json({ error: "Error al listar planificación." });
  }
}

async function agregarPlanificacion(req, res) {
  const { alcance, periodicidad, criterios } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("alcance", alcance)
      .input("periodicidad", periodicidad)
      .input("criterios", criterios)
      .query(`
        INSERT INTO PlanificacionAuditorias
          (Alcance, Periodicidad, Criterios, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@alcance, @periodicidad, @criterios, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear planificación:", err);
    res.status(500).json({ error: "Error al crear planificación." });
  }
}

async function actualizarPlanificacion(req, res) {
  const id = parseInt(req.params.id, 10);
  const { alcance, periodicidad, criterios } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("alcance", alcance)
      .input("periodicidad", periodicidad)
      .input("criterios", criterios)
      .query(`
        UPDATE PlanificacionAuditorias
        SET Alcance      = @alcance,
            Periodicidad = @periodicidad,
            Criterios    = @criterios,
            UpdatedAt    = GETDATE()
        WHERE ID = @id;
        SELECT * FROM PlanificacionAuditorias WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar planificación:", err);
    res.status(500).json({ error: "Error al actualizar planificación." });
  }
}

async function eliminarPlanificacion(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", id)
      .query("DELETE FROM PlanificacionAuditorias WHERE ID = @id");
    res.json({ message: "Planificación eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar planificación:", err);
    res.status(500).json({ error: "Error al eliminar planificación." });
  }
}

// 2. Ejecución de auditorías (CRUD)
async function listarAuditorias(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query("SELECT * FROM Auditorias ORDER BY CreatedAt DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar auditorías:", err);
    res.status(500).json({ error: "Error al listar auditorías." });
  }
}

async function agregarAuditoria(req, res) {
  const { fecha, responsable, estado } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("fecha", fecha)
      .input("responsable", responsable)
      .input("estado", estado)
      .query(`
        INSERT INTO Auditorias
          (Fecha, Responsable, Estado, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@fecha, @responsable, @estado, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear auditoría:", err);
    res.status(500).json({ error: "Error al crear auditoría." });
  }
}

async function actualizarAuditoria(req, res) {
  const id = parseInt(req.params.id, 10);
  const { fecha, responsable, estado } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("fecha", fecha)
      .input("responsable", responsable)
      .input("estado", estado)
      .query(`
        UPDATE Auditorias
        SET Fecha       = @fecha,
            Responsable = @responsable,
            Estado      = @estado,
            UpdatedAt   = GETDATE()
        WHERE ID = @id;
        SELECT * FROM Auditorias WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar auditoría:", err);
    res.status(500).json({ error: "Error al actualizar auditoría." });
  }
}

async function eliminarAuditoria(req, res) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", id)
      .query("DELETE FROM Auditorias WHERE ID = @id");
    res.json({ message: "Auditoría eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar auditoría:", err);
    res.status(500).json({ error: "Error al eliminar auditoría." });
  }
}

// 3. Checklist dinámico
async function getChecklist(req, res) {
  const audId = parseInt(req.params.id, 10);
  if (isNaN(audId)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("audId", audId)
      .query("SELECT * FROM AuditoriasChecklist WHERE AuditoriaID = @audId");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener checklist:", err);
    res.status(500).json({ error: "Error al obtener checklist." });
  }
}

async function toggleChecklistItem(req, res) {
  const itemId = parseInt(req.params.itemId, 10);
  const { completado } = req.body;
  if (isNaN(itemId)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("itemId", itemId)
      .input("completado", completado)
      .query("UPDATE AuditoriasChecklist SET Completado = @completado, UpdatedAt = GETDATE() WHERE ID = @itemId");
    res.sendStatus(204);
  } catch (err) {
    console.error("Error al actualizar checklist:", err);
    res.status(500).json({ error: "Error al actualizar checklist." });
  }
}

// 4. Hallazgos
async function listarHallazgos(req, res) {
  const audId = parseInt(req.params.id, 10);
  if (isNaN(audId)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("audId", audId)
      .query(`
        SELECT 
          ID as id, Tipo as tipo, Descripcion as descripcion,
          EvidenciaUrl as evidenciaUrl, CreatedAt as createdAt
        FROM AuditoriasHallazgos
        WHERE AuditoriaID = @audId
        ORDER BY CreatedAt DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar hallazgos:", err);
    res.status(500).json({ error: "Error al listar hallazgos." });
  }
}

async function crearHallazgo(req, res) {
  const audId = parseInt(req.params.id, 10);
  if (isNaN(audId)) return res.status(400).json({ error: "ID inválido" });
  const { tipo, descripcion } = req.body;
  const evidenciaUrl = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("audId", audId)
      .input("tipo", tipo)
      .input("descripcion", descripcion)
      .input("evidenciaUrl", evidenciaUrl)
      .query(`
        INSERT INTO AuditoriasHallazgos
          (AuditoriaID, Tipo, Descripcion, EvidenciaUrl, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@audId, @tipo, @descripcion, @evidenciaUrl, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear hallazgo:", err);
    res.status(500).json({ error: "Error al crear hallazgo." });
  }
}

// 5. Acciones Correctivas / Preventivas
async function listarAcciones(req, res) {
  const audId = parseInt(req.params.id, 10);
  if (isNaN(audId)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("audId", audId)
      .query("SELECT * FROM AccionesAuditorias WHERE AuditoriaID = @audId ORDER BY CreatedAt DESC");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar acciones:", err);
    res.status(500).json({ error: "Error al listar acciones." });
  }
}

async function crearAccion(req, res) {
  const audId = parseInt(req.params.id, 10);
  if (isNaN(audId)) return res.status(400).json({ error: "ID inválido" });
  const { descripcion, responsable, vencimiento, estado, prioridad } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("auditoriaID", audId)
      .input("descripcion", descripcion)
      .input("responsable", responsable)
      .input("vencimiento", vencimiento)
      .input("estado", estado)
      .input("prioridad", prioridad)
      .query(`
        INSERT INTO AccionesAuditorias
          (AuditoriaID, Descripcion, Responsable, Vencimiento, Estado, Prioridad, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@auditoriaID, @descripcion, @responsable, @vencimiento, @estado, @prioridad, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear acción:", err);
    res.status(500).json({ error: "Error al crear acción." });
  }
}

async function actualizarAccion(req, res) {
  const accionId = parseInt(req.params.accionId, 10);
  if (isNaN(accionId)) return res.status(400).json({ error: "ID inválido" });
  const { descripcion, responsable, vencimiento, estado, prioridad } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("idLabel", accionId)
      .input("descripcion", descripcion)
      .input("responsable", responsable)
      .input("vencimiento", vencimiento)
      .input("estado", estado)
      .input("prioridad", prioridad)
      .query(`
        UPDATE AccionesAuditorias
        SET Descripcion = @descripcion,
            Responsable = @responsable,
            Vencimiento  = @vencimiento,
            Estado       = @estado,
            Prioridad    = @prioridad,
            UpdatedAt    = GETDATE()
        WHERE ID = @idLabel;
        SELECT * FROM AccionesAuditorias WHERE ID = @idLabel;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar acción:", err);
    res.status(500).json({ error: "Error al actualizar acción." });
  }
}

async function eliminarAccion(req, res) {
  const accionId = parseInt(req.params.accionId, 10);
  if (isNaN(accionId)) return res.status(400).json({ error: "ID inválido" });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("idLabel", accionId)
      .query("DELETE FROM AccionesAuditorias WHERE ID = @idLabel");
    res.json({ message: "Acción eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar acción:", err);
    res.status(500).json({ error: "Error al eliminar acción." });
  }
}

// 6. Informes / Reportes
async function getEstadisticas(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("fechaInicio", fechaInicio || null)
      .input("fechaFin", fechaFin || null)
      .query(`
        SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN Estado='Completada' THEN 1 ELSE 0 END) AS completadas,
          SUM(CASE WHEN Estado='Pendiente' THEN 1 ELSE 0 END) AS pendientes
        FROM Auditorias
        WHERE (@fechaInicio IS NULL OR CreatedAt >= @fechaInicio)
          AND (@fechaFin   IS NULL OR CreatedAt <= @fechaFin);
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error al obtener estadísticas." });
  }
}

async function getInformeDetalle(req, res) {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const pool = await poolPromise;
    const result = await pool.request()
      .input("fechaInicio", fechaInicio || null)
      .input("fechaFin", fechaFin || null)
      .query(`
        SELECT * FROM Auditorias
        WHERE (@fechaInicio IS NULL OR CreatedAt >= @fechaInicio)
          AND (@fechaFin   IS NULL OR CreatedAt <= @fechaFin)
        ORDER BY CreatedAt DESC;
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al obtener informe detalle:", err);
    res.status(500).json({ error: "Error al obtener informe detalle." });
  }
}

// 7. Administración: CRUD Tipos de Auditoría
async function listarTipos(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM TiposAuditoria ORDER BY Nombre");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar tipos:", err);
    res.status(500).json({ error: "Error al listar tipos." });
  }
}

async function crearTipo(req, res) {
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("nombre", nombre)
      .input("descripcion", descripcion)
      .query(`
        INSERT INTO TiposAuditoria (Nombre, Descripcion, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear tipo:", err);
    res.status(500).json({ error: "Error al crear tipo." });
  }
}

async function updateTipo(req, res) {
  const id = parseInt(req.params.id, 10);
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("nombre", nombre)
      .input("descripcion", descripcion)
      .query(`
        UPDATE TiposAuditoria
        SET Nombre = @nombre, Descripcion = @descripcion, UpdatedAt = GETDATE()
        WHERE ID = @id;
        SELECT * FROM TiposAuditoria WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar tipo:", err);
    res.status(500).json({ error: "Error al actualizar tipo." });
  }
}

async function deleteTipo(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id)
      .query("DELETE FROM TiposAuditoria WHERE ID = @id");
    res.json({ message: "Tipo eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar tipo:", err);
    res.status(500).json({ error: "Error al eliminar tipo." });
  }
}

// 8. Administración: CRUD Roles
async function listarRoles(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM RolesAuditoria ORDER BY Nombre");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar roles:", err);
    res.status(500).json({ error: "Error al listar roles." });
  }
}

async function crearRole(req, res) {
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("nombre", nombre)
      .input("descripcion", descripcion)
      .query(`
        INSERT INTO RolesAuditoria (Nombre, Descripcion, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear role:", err);
    res.status(500).json({ error: "Error al crear role." });
  }
}

async function updateRole(req, res) {
  const id = parseInt(req.params.id, 10);
  const { nombre, descripcion } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("nombre", nombre)
      .input("descripcion", descripcion)
      .query(`
        UPDATE RolesAuditoria
        SET Nombre = @nombre, Descripcion = @descripcion, UpdatedAt = GETDATE()
        WHERE ID = @id;
        SELECT * FROM RolesAuditoria WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar role:", err);
    res.status(500).json({ error: "Error al actualizar role." });
  }
}

async function deleteRole(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id)
      .query("DELETE FROM RolesAuditoria WHERE ID = @id");
    res.json({ message: "Role eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar role:", err);
    res.status(500).json({ error: "Error al eliminar role." });
  }
}

// 9. Administración: CRUD ChecklistMaster
async function listarChecklistMaster(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM ChecklistMaster ORDER BY Item");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar checklist master:", err);
    res.status(500).json({ error: "Error al listar checklist master." });
  }
}

async function createChecklistItem(req, res) {
  const { item, categoria } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("item", item)
      .input("categoria", categoria)
      .query(`
        INSERT INTO ChecklistMaster (Item, Categoria, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@item, @categoria, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear checklist item:", err);
    res.status(500).json({ error: "Error al crear checklist item." });
  }
}

async function updateChecklistItem(req, res) {
  const id = parseInt(req.params.id, 10);
  const { item, categoria } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("item", item)
      .input("categoria", categoria)
      .query(`
        UPDATE ChecklistMaster
        SET Item = @item, Categoria = @categoria, UpdatedAt = GETDATE()
        WHERE ID = @id;
        SELECT * FROM ChecklistMaster WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar checklist item:", err);
    res.status(500).json({ error: "Error al actualizar checklist item." });
  }
}

async function deleteChecklistItem(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id)
      .query("DELETE FROM ChecklistMaster WHERE ID = @id");
    res.json({ message: "Checklist item eliminado correctamente." });
  } catch (err) {
    console.error("Error al eliminar checklist item:", err);
    res.status(500).json({ error: "Error al eliminar checklist item." });
  }
}

// 10. Administración: CRUD PlantillasAuditoria
async function listarPlantillasAdmin(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM PlantillasAuditoria ORDER BY Nombre");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar plantillas auditoria:", err);
    res.status(500).json({ error: "Error al listar plantillas auditoria." });
  }
}

async function createPlantilla(req, res) {
  const { nombre, contenido } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("nombre", nombre)
      .input("contenido", contenido)
      .query(`
        INSERT INTO PlantillasAuditoria (Nombre, Contenido, CreatedAt)
        OUTPUT INSERTED.*
        VALUES (@nombre, @contenido, GETDATE())
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error("Error al crear plantilla auditoria:", err);
    res.status(500).json({ error: "Error al crear plantilla auditoria." });
  }
}

async function updatePlantilla(req, res) {
  const id = parseInt(req.params.id, 10);
  const { nombre, contenido } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("nombre", nombre)
      .input("contenido", contenido)
      .query(`
        UPDATE PlantillasAuditoria
        SET Nombre = @nombre, Contenido = @contenido, UpdatedAt = GETDATE()
        WHERE ID = @id;
        SELECT * FROM PlantillasAuditoria WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar plantilla auditoria:", err);
    res.status(500).json({ error: "Error al actualizar plantilla auditoria." });
  }
}

async function deletePlantilla(req, res) {
  const id = parseInt(req.params.id, 10);
  try {
    const pool = await poolPromise;
    await pool.request().input("id", id)
      .query("DELETE FROM PlantillasAuditoria WHERE ID = @id");
    res.json({ message: "Plantilla auditoria eliminada correctamente." });
  } catch (err) {
    console.error("Error al eliminar plantilla auditoria:", err);
    res.status(500).json({ error: "Error al eliminar plantilla auditoria." });
  }
}

// 11. Administración: NotificacionesConfig
async function listarNotificacionesConfig(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM NotificacionesConfig");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar notificaciones:", err);
    res.status(500).json({ error: "Error al listar notificaciones." });
  }
}

async function updateNotificacionesConfig(req, res) {
  const id = parseInt(req.params.id, 10);
  const { canal, destinatarios, activo } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("canal", canal)
      .input("destinatarios", destinatarios)
      .input("activo", activo)
      .query(`
        UPDATE NotificacionesConfig
        SET Canal = @canal, Destinatarios = @destinatarios, Activo = @activo, UpdatedAt = GETDATE()
        WHERE ID = @id;
        SELECT * FROM NotificacionesConfig WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar notificaciones:", err);
    res.status(500).json({ error: "Error al actualizar notificaciones." });
  }
}

// 12. Administración: ParametrosAuditoria
async function listarParametros(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM ParametrosAuditoria");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error al listar parámetros:", err);
    res.status(500).json({ error: "Error al listar parámetros." });
  }
}

async function updateParametros(req, res) {
  const id = parseInt(req.params.id, 10);
  const { clave, valor } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", id)
      .input("clave", clave)
      .input("valor", valor)
      .query(`
        UPDATE ParametrosAuditoria
        SET Clave = @clave, Valor = @valor, UpdatedAt = GETDATE()
        WHERE ID = @id;
        SELECT * FROM ParametrosAuditoria WHERE ID = @id;
      `);
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error al actualizar parámetros:", err);
    res.status(500).json({ error: "Error al actualizar parámetros." });
  }
}

module.exports = {
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
  // Admin:
  listarTipos, crearTipo, updateTipo, deleteTipo,
  listarRoles, crearRole, updateRole, deleteRole,
  listarChecklistMaster, createChecklistItem, updateChecklistItem, deleteChecklistItem,
  listarPlantillasAdmin, createPlantilla, updatePlantilla, deletePlantilla,
  listarNotificacionesConfig, updateNotificacionesConfig,
  listarParametros, updateParametros,
  upload
};
