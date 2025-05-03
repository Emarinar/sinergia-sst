// src/components/UI/ModuleButton.jsx
import React from "react";
import { Button } from "react-bootstrap";
import "./ModuleButton.css"; // Archivo de estilos custom

const ModuleButton = ({ icon, label, onClick }) => {
  return (
    <Button className="module-button" onClick={onClick} variant="outline-light">
      <span className="module-icon me-2">{icon}</span>
      <span className="module-label">{label}</span>
    </Button>
  );
};

export default ModuleButton;
