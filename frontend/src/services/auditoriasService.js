import axios from 'axios';

// Base URL para todas las rutas de auditorías
const API = axios.create({ baseURL: '/api/auditorias' });

// Inyectar token en cada petición
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ——— Ejecución ———
export function getEjecuciones() {
  return API.get('/');
}

// ——— Planificación ———
export function getPlanes() {
  return API.get('/planificacion');
}
export function createPlan(data) {
  return API.post('/planificacion', data);
}
export function updatePlan(id, data) {
  return API.put(`/planificacion/${id}`, data);
}
export function deletePlan(id) {
  return API.delete(`/planificacion/${id}`);
}

// ——— Checklist ———
export function getChecklist(auditoriaId) {
  return API.get(`/${auditoriaId}/checklist`);
}
export function toggleChecklist(itemId, data) {
  return API.put(`/checklist/${itemId}`, data);
}

// ——— Hallazgos ———
export function getHallazgos(auditoriaId) {
  return API.get(`/${auditoriaId}/hallazgos`);
}
export function createHallazgo(auditoriaId, formData) {
  return API.post(`/${auditoriaId}/hallazgos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
}

// ——— Acciones ———
export function getAcciones(auditoriaId) {
  return API.get(`/${auditoriaId}/acciones`);
}
export function createAccion(auditoriaId, data) {
  return API.post(`/${auditoriaId}/acciones`, data);
}
export function updateAccion(auditoriaId, accionId, data) {
  return API.put(`/${auditoriaId}/acciones/${accionId}`, data);
}
export function deleteAccion(auditoriaId, accionId) {
  return API.delete(`/${auditoriaId}/acciones/${accionId}`);
}

// ——— Informes ———
export function getEstadisticas(rango = {}) {
  return API.get('/informes/estadisticas', { params: rango });
}
export function getInformeDetalle(rango = {}) {
  return API.get('/informes/detalle', { params: rango });
}

// ——— Administración ———
// Tipos de auditoría
export function getTipos() {
  return API.get('/admin/tipos');
}
export function createTipo(data) {
  return API.post('/admin/tipos', data);
}
export function updateTipo(id, data) {
  return API.put(`/admin/tipos/${id}`, data);
}
export function deleteTipo(id) {
  return API.delete(`/admin/tipos/${id}`);
}

// Roles de auditoría
export function getRoles() {
  return API.get('/admin/roles');
}
export function createRole(data) {
  return API.post('/admin/roles', data);
}
export function updateRole(id, data) {
  return API.put(`/admin/roles/${id}`, data);
}
export function deleteRole(id) {
  return API.delete(`/admin/roles/${id}`);
}

// Checklist maestro
export function getChecklistMaster() {
  return API.get('/admin/checklist');
}
export function createChecklistItem(data) {
  return API.post('/admin/checklist', data);
}
export function updateChecklistItem(id, data) {
  return API.put(`/admin/checklist/${id}`, data);
}
export function deleteChecklistItem(id) {
  return API.delete(`/admin/checklist/${id}`);
}

// Plantillas de informe
export function getPlantillas() {
  return API.get('/admin/plantillas');
}
export function createPlantilla(data) {
  return API.post('/admin/plantillas', data);
}
export function updatePlantilla(id, data) {
  return API.put(`/admin/plantillas/${id}`, data);
}
export function deletePlantilla(id) {
  return API.delete(`/admin/plantillas/${id}`);
}

// Configuración de notificaciones
export function getNotificacionesConfig() {
  return API.get('/admin/notificaciones');
}
export function updateNotificacionesConfig(data) {
  return API.put('/admin/notificaciones', data);
}

// Parámetros generales
export function getParametros() {
  return API.get('/admin/parametros');
}
export function updateParametros(data) {
  return API.put('/admin/parametros', data);
}

// ——— Export por defecto ———
export default {
  getEjecuciones,
  getPlanes,
  createPlan,
  updatePlan,
  deletePlan,
  getChecklist,
  toggleChecklist,
  getHallazgos,
  createHallazgo,
  getAcciones,
  createAccion,
  updateAccion,
  deleteAccion,
  getEstadisticas,
  getInformeDetalle,
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getChecklistMaster,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getPlantillas,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  getNotificacionesConfig,
  updateNotificacionesConfig,
  getParametros,
  updateParametros
};
