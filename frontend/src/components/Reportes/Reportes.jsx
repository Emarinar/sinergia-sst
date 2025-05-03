import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Form, Button, Alert } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const Reportes = () => {
  // Estados para filtros y datos del informe
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState("");

  // Función para obtener datos del informe desde la API
  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");
      // La API debe recibir startDate y endDate y devolver un arreglo de objetos con "label" y "value"
      const res = await axios.get("http://localhost:5000/api/reportes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      });
      setReportData(res.data);
      setError("");
    } catch (err) {
      console.error("Error al obtener informes:", err);
      setError("Error al obtener informes.");
    }
  };

  // Funciones para exportar (placeholder)
  const handleExportPDF = () => {
    alert("Informe exportado a PDF");
  };

  const handleExportExcel = () => {
    alert("Informe exportado a Excel");
  };

  return (
    <Container className="mt-4">
      <h2>Informes</h2>

      {/* Filtros */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filtros del Informe</Card.Title>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group controlId="startDate" className="mb-3">
                  <Form.Label>Fecha Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="endDate" className="mb-3">
                  <Form.Label>Fecha Fin</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end mb-3">
                <Button variant="primary" onClick={fetchReport}>
                  Generar Informe
                </Button>
              </Col>
            </Row>
          </Form>
          {error && <Alert variant="danger">{error}</Alert>}
        </Card.Body>
      </Card>

      {/* Gráfico interactivo */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Gráfico de Informe</Card.Title>
              {reportData && reportData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData}>
                    <XAxis dataKey="label" stroke="#374151" />
                    <YAxis stroke="#374151" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No hay datos para mostrar.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabla de detalles */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Detalles del Informe</Card.Title>
              {reportData && reportData.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Etiqueta</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.label}</td>
                        <td>{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No hay datos para mostrar.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Botones de exportación */}
      <Row>
        <Col className="text-end">
          <Button variant="outline-primary" className="me-2" onClick={handleExportPDF}>
            Exportar a PDF
          </Button>
          <Button variant="outline-success" onClick={handleExportExcel}>
            Exportar a Excel
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Reportes;
