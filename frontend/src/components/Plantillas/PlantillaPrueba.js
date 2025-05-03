// src/components/PlantillaPrueba.js
import React, { useState } from "react";
import { Container, Button, Modal, Form, Alert } from "react-bootstrap";
import MyEditorDraft from "../MyEditorDraft";

const PlantillaPrueba = () => {
  const [contenidoHTML, setContenidoHTML] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const handleGuardar = (e) => {
    e.preventDefault();
    if (!contenidoHTML) {
      setError("El contenido no puede estar vacío.");
      return;
    }
    // Aquí podrías guardar la plantilla en backend o en estado global
    setError("");
    setShowPreview(true);
  };

  return (
    <Container className="mt-4">
      <h2>Crear Plantilla de Prueba SST</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleGuardar}>
        <Form.Group className="mb-3">
          <Form.Label>Contenido de la Plantilla</Form.Label>
          <MyEditorDraft
            initialContent="<p>Escribe aquí tu plantilla...</p>"
            onContentChange={(html) => setContenidoHTML(html)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Guardar y Previsualizar
        </Button>
      </Form>

      {/* Modal de Vista Previa */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vista Previa de la Plantilla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Renderizamos el HTML de la plantilla */}
          <div dangerouslySetInnerHTML={{ __html: contenidoHTML }} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PlantillaPrueba;
