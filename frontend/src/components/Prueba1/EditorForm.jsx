// src/components/Formularios/EditorForm.jsx
import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { Button, Alert } from "react-bootstrap";
import "./Formularios.css";

const EditorForm = ({ onFormSaved }) => {
  // Definir un schema inicial (puedes personalizarlo según necesidades)
  const initialSchema = {
    title: "Nuevo Formulario",
    type: "object",
    required: ["pregunta1"],
    properties: {
      pregunta1: { type: "string", title: "Pregunta 1" },
      pregunta2: { type: "string", title: "Pregunta 2" }
    }
  };

  const [schema, setSchema] = useState(initialSchema);
  const [uiSchema, setUiSchema] = useState({});
  const [error, setError] = useState("");

  const handleSubmit = ({ formData }) => {
    // Aquí guardarías el formulario en la base de datos, por ejemplo, mediante una llamada a la API
    // Por ahora, simulamos el guardado:
    if (onFormSaved) {
      onFormSaved({ ...formData, schema, createdAt: new Date().toISOString() });
    }
  };

  return (
    <div className="editor-form-container">
      <h4>Crear Formulario</h4>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
        onSubmit={handleSubmit}
        onError={(errors) =>
          setError("Por favor, corrige los errores en el formulario.")
        }
      >
        <Button variant="primary" type="submit">
          Guardar Formulario
        </Button>
      </Form>
    </div>
  );
};

export default EditorForm;
