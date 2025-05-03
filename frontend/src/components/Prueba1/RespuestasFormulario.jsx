import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './Formularios.css';

const RespuestasFormulario = () => {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRespuestas();
  }, []);

  const fetchRespuestas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Llama al endpoint que devuelve las respuestas del formulario
      const res = await axios.get('http://localhost:5000/api/formularios/respuestas', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRespuestas(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener respuestas:", error);
      setLoading(false);
    }
  };

  return (
    <div className="respuestas-formulario-container">
      <h4>Respuestas de Formularios</h4>
      {loading ? (
        <Spinner animation="border" variant="primary" />
      ) : respuestas.length === 0 ? (
        <p>No se han registrado respuestas.</p>
      ) : (
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Formulario</th>
              <th>Respuesta</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map(resp => (
              <tr key={resp.ID}>
                <td>{resp.ID}</td>
                <td>{resp.formularioID}</td>
                <td>{resp.respuesta}</td>
                <td>{new Date(resp.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default RespuestasFormulario;
