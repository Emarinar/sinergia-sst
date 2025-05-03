import React, { useState } from 'react';
import { Container, Tabs, Tab, Button, Modal } from 'react-bootstrap';
import FormulariosList from './FormulariosList.jsx';
import CrearFormulario from './CrearFormulario.jsx';
import RespuestasList from './RespuestasList.jsx';
import './Formularios.css';

const Formularios = () => {
  const [activeTab, setActiveTab] = useState('lista');
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [editingForm, setEditingForm] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleShare = id => {
    setShareLink(`${window.location.origin}/public/formularios/${id}`);
    setShowModal(true);
  };

  const handleSelect = id => {
    setSelectedFormId(id);
    setActiveTab('respuestas');
  };

  const handleEdit = form => {
    setEditingForm(form);
    setActiveTab('editar');
  };

  const handleCreated = id => {
    setSelectedFormId(id);
    setActiveTab('respuestas');
  };

  return (
    <Container className="formularios-container mt-4">
      <h2>Gestión de Formularios</h2>

      <Tabs
        id="formularios-tabs"
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-3"
      >
        <Tab eventKey="lista" title="Listado">
          <FormulariosList
            onShare={handleShare}
            onSelectForm={handleSelect}
            onEditForm={handleEdit}
          />
        </Tab>

        <Tab
          eventKey="respuestas"
          title="Respuestas"
          disabled={!selectedFormId}
        >
          {selectedFormId ? (
            <RespuestasList formId={selectedFormId} />
          ) : (
            <p className="text-center">
              Selecciona un formulario en la pestaña “Listado”
            </p>
          )}
        </Tab>

        <Tab eventKey="crear" title="Crear">
          <CrearFormulario onSuccess={handleCreated} />
        </Tab>

        <Tab
          eventKey="editar"
          title="Editar"
          disabled={!editingForm}
        >
          {editingForm ? (
            <CrearFormulario
              existing={editingForm}
              onSuccess={handleCreated}
            />
          ) : (
            <p className="text-center">
              Selecciona “Editar” en la lista para modificar un formulario
            </p>
          )}
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Compartir Formulario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Copia este enlace para compartir:</p>
          <input
            className="form-control"
            readOnly
            value={shareLink}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Formularios;
