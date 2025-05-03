import React, { useState } from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import AuditoriasPlanificacion from "./AuditoriasPlanificacion";
import AuditoriasEjecucion from "./AuditoriasEjecucion";
import AuditoriasSeguimiento from "./AuditoriasSeguimiento";
import AuditoriasInformes from "./AuditoriasInformes";
import AuditoriasAdministracion from "./AuditoriasAdministracion";
import "./Auditorias.css";

const Auditorias = () => {
  const [key, setKey] = useState("planificacion");

  return (
    <Container className="auditorias-container mt-4">
      <h2>Gestión de Auditorías</h2>
      <Tabs
        id="auditorias-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="planificacion" title="Planificación">
          <AuditoriasPlanificacion />
        </Tab>
        <Tab eventKey="ejecucion" title="Ejecución">
          <AuditoriasEjecucion />
        </Tab>
        <Tab eventKey="seguimiento" title="Seguimiento">
          <AuditoriasSeguimiento />
        </Tab>
        <Tab eventKey="informes" title="Informes">
          <AuditoriasInformes />
        </Tab>
        <Tab eventKey="administracion" title="Administración">
          <AuditoriasAdministracion />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Auditorias;
