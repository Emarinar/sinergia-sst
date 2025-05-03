import React from "react";
import Form from "@rjsf/core";
import "./Formularios.css";

const VistaPreviaForm = ({ schema, uiSchema, formData }) => {
  return (
    <div className="vista-previa-form-container">
      <h4>Vista Previa del Formulario</h4>
      {/* Renderizamos el formulario con el schema guardado */}
      <Form schema={schema} uiSchema={uiSchema} formData={formData} disabled={true} />
    </div>
  );
};

export default VistaPreviaForm;
