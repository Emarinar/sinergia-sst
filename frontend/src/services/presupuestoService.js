import axios from 'axios';

export async function getGastos(token) {
  const res = await axios.get("http://localhost:5000/api/presupuesto", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function createGasto(data, token) {
  const res = await axios.post("http://localhost:5000/api/presupuesto", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.gasto;
}
