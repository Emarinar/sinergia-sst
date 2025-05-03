import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { fetchResponses } from '../../services/formService';
import './Formularios.css';

const RespuestasList = ({ formId, pollInterval = 5000 }) => {
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetchResponses(formId)
      .then(data => {
        setRespuestas(data);
        setError('');
      })
      .catch(err => {
        console.error('Error al cargar respuestas:', err);
        setError('No se pudieron cargar las respuestas.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!formId) return;
    load();
    const timer = setInterval(load, pollInterval);
    return () => clearInterval(timer);
  }, [formId]);

  if (loading && !respuestas.length) {
    return <div className="loading-container"><Spinner /></div>;
  }
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  if (!respuestas.length) {
    return <p>No hay respuestas aún.</p>;
  }

  const headers = Object.keys(respuestas[0].valores);

  return (
    <div className="formularios-list">
      <h3>Respuestas en Tiempo Real</h3>
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>#</th>
            <th>Fecha</th>
            {headers.map(h => <th key={h}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {respuestas.map((r, idx) => (
            <tr key={r.RespuestaID}>
              <td>{idx + 1}</td>
              <td>{new Date(r.CreatedAt).toLocaleString()}</td>
              {headers.map(h => <td key={h}>{r.valores[h]}</td>)}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default RespuestasList;
