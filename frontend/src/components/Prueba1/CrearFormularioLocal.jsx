// src/components/Formularios/CrearFormularioLocal.jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Modal } from 'react-bootstrap';
import { createMicrosoftForm } from '../../services/microsoftService';
import { useMicrosoftForms } from '../../context/microsoftFormsState';
import './Formularios.css';

const CrearFormularioLocal = ({ onFormCreated }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMSForm, setUseMSForm] = useState(false);
  const [showMSModal, setShowMSModal] = useState(false);
  const { setMsForms } = useMicrosoftForms();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (useMSForm) {
        // Lógica para crear formulario a través de Microsoft Forms
        const msForm = await createMicrosoftForm({ nombre, descripcion }, token);
        // Actualiza el contexto si es necesario
        setMsForms(prev => [...prev, msForm]);
        if (onFormCreated) onFormCreated(msForm);
      } else {
        // Lógica para crear formulario local (puedes enviar datos al backend)
        const newForm = { ID: Date.now(), nombre, descripcion, createdAt: new Date().toISOString() };
        if (onFormCreated) onFormCreated(newForm);
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
      <h4>Crear Formulario</h4>
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
            placeholder="Instrucciones o descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formIntegracion" className="mb-3">
          <Form.Check
            type="checkbox"
            label="Integrar con Microsoft Forms"
            checked={useMSForm}
            onChange={(e) => setUseMSForm(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Formulario"}
        </Button>
      </Form>

      {/* Modal para integrar Microsoft Forms */}
      <Modal show={showMSModal} onHide={() => setShowMSModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Integrar Microsoft Forms</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Aquí puedes insertar un iframe o la interfaz de Microsoft Forms */}
          <p>Aquí se mostraría la interfaz de Microsoft Forms para crear el formulario.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMSModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CrearFormularioLocal;
