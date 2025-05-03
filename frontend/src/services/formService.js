import axios from 'axios';

const API = 'http://localhost:5000/api/formularios';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const fetchForms = async () => {
  const { data } = await axios.get(API, { headers: authHeaders() });
  return data;
};

export const fetchForm = async id => {
  const { data } = await axios.get(`${API}/${id}`, { headers: authHeaders() });
  return data;
};

export const createForm = async form => {
  const { data } = await axios.post(API, form, { headers: authHeaders() });
  return data;
};

export const updateForm = async (id, form) => {
  const { data } = await axios.put(`${API}/${id}`, form, { headers: authHeaders() });
  return data;
};

export const deleteForm = async id => {
  await axios.delete(`${API}/${id}`, { headers: authHeaders() });
};

export const submitResponse = async (id, payload, isPublic = false) => {
  const url = isPublic
    ? `${API}/public/${id}/responder`
    : `${API}/${id}/responder`;
  const opts = isPublic ? {} : { headers: authHeaders() };
  const { data } = await axios.post(url, payload, opts);
  return data;
};

export const exportResponses = (id, isPublic = false) => {
  const url = isPublic
    ? `${API}/public/${id}/export`
    : `${API}/${id}/export`;
  window.open(url, '_blank');
};

export const fetchResponses = async id => {
  const { data } = await axios.get(`${API}/${id}/respuestas`, {
    headers: authHeaders()
  });
  return data;
};
