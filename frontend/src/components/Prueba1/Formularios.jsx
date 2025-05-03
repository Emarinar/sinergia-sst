import React, { useState } from "react";
import { Container, Tabs, Tab, InputGroup, FormControl, Spinner } from "react-bootstrap";
import EditorForm from "./EditorForm";
import VistaPreviaForm from "./VistaPreviaForm";
import RespuestasFormulario from "./RespuestasFormulario";
import "./Formularios.css";

const Formularios = () => {
  const [activeTab, setActiveTab] = useState("crear");
  const [formSchema, setFormSchema] = useState(null);
  const [formUiSchema, setFormUiSchema] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFormSaved = (newForm) => {
    setFormSchema(newForm.schema);
    setFormData(newForm);
    setActiveTab("preview");
  };

  return (
    <Container className="formularios-container mt-4">
      <h2 className="text-center mb-4">Gestión de Formularios</h2>
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} fill className="mb-3">
        <Tab eventKey="crear" title="Crear Formulario">
          <EditorForm onFormSaved={handleFormSaved} />
        </Tab>
        <Tab eventKey="preview" title="Vista Previa">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : formSchema ? (
            <VistaPreviaForm schema={formSchema} uiSchema={formUiSchema} formData={formData} />
          ) : (
            <p>No hay formulario para mostrar.</p>
          )}
        </Tab>
        <Tab eventKey="respuestas" title="Respuestas">
          <RespuestasFormulario />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Formularios;
