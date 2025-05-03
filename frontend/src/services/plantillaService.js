import axios from 'axios';

const BASE = 'http://localhost:5000/api/plantillas';
const token = () => localStorage.getItem('token');
const auth = () => ({ headers: { Authorization: `Bearer ${token()}` } });

export const getAll = () =>
  axios.get(BASE, auth()).then(r => r.data);

export const create = data =>
  axios.post(BASE, data, auth()).then(r => r.data.plantilla);

export const update = (id, data) =>
  axios.put(`${BASE}/${id}`, data, auth()).then(r => r.data.plantilla);

export const remove = id =>
  axios.delete(`${BASE}/${id}`, auth());

export const generatePDF = id =>
  axios.get(`${BASE}/generar-pdf/${id}`, auth());
