// src/components/FormValidation.jsx
import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { isValidEmail, isNotEmpty, isNumeric, isValidDate } from "../utils/validations";

const FormValidation = () => {
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isNotEmpty(email) || !isValidEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }
    if (!isNumeric(age)) {
      setError("La edad debe ser un número.");
      return;
    }
    if (!isValidDate(dob)) {
      setError("La fecha de nacimiento no es válida. Use el formato YYYY-MM-DD.");
      return;
    }

    setMessage("Todos los datos son válidos.");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3>Ejemplo de Validaciones</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="Ingrese su correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formAge" className="mb-3">
          <Form.Label>Edad</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese su edad"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formDob" className="mb-3">
          <Form.Label>Fecha de Nacimiento (YYYY-MM-DD)</Form.Label>
          <Form.Control
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Validar Datos
        </Button>
      </Form>
    </div>
  );
};

export default FormValidation;
