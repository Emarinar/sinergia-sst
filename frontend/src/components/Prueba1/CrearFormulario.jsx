import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Formularios.css';

const CrearFormulario = ({ onFormCreated }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/formularios',
        { nombre, descripcion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onFormCreated) {
        onFormCreated(res.data.formulario);
      }
      setNombre('');
      setDescripcion('');
    } catch (err) {
      console.error("Error al crear formulario:", err);
      setError("Error al crear formulario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-formulario-container">
      <h4>Crear Formulario Local</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formNombre" className="mb-3">
          <Form.Label>Nombre del Formulario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="formDescripcion" className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Descripción o instrucciones"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Formulario"}
        </Button>
      </Form>
    </div>
  );
};

export default CrearFormulario;
