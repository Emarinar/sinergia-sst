import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Formularios.css';

const IntegrarMicrosoftForm = ({ onFormCreated }) => {
  const [showModal, setShowModal] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIntegrate = async () => {
    if (!formUrl) {
      setError("Ingrese el URL del formulario de Microsoft Forms.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/formularios/integrar',
        { formUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onFormCreated) {
        onFormCreated(res.data.formulario);
      }
      setFormUrl('');
      setShowModal(false);
    } catch (err) {
      console.error("Error al integrar formulario:", err);
      setError("Error al integrar formulario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="integrar-ms-form-container mt-3">
        <h5>Integrar Formulario de Microsoft Forms</h5>
        <Button variant="outline-secondary" onClick={() => setShowModal(true)}>
          Integrar Formulario
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Integrar Microsoft Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="msFormUrl" className="mb-3">
            <Form.Label>URL del Formulario</Form.Label>
            <Form.Control
              type="url"
              placeholder="Ingrese el URL del formulario"
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleIntegrate} disabled={loading}>
            {loading ? "Integrando..." : "Integrar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default IntegrarMicrosoftForm;
