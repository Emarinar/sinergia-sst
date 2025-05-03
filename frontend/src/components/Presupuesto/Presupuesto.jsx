import React, { useState } from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import PresupuestoForm from "./presupuestoForm";
import PresupuestoDashboard from "./PresupuestoDashboard";
import "./Presupuesto.css";

const Presupuesto = () => {
  const [key, setKey] = useState("form");

  return (
    <Container fluid className="presupuesto-container mt-4">
      <h2>Módulo de Presupuesto</h2>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 presupuesto-tabs"
      >
        <Tab eventKey="form" title="Registrar Gasto">
          <PresupuestoForm />
        </Tab>
        <Tab eventKey="dashboard" title="Dashboard de Gastos">
          <PresupuestoDashboard />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Presupuesto;
