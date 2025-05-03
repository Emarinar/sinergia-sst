import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Form,
  Button,
  Row,
  Col
} from "react-bootstrap";
import { getGastos } from "../../services/presupuestoService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import "./Presupuesto.css";

const PresupuestoDashboard = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const data = await getGastos(token);
        setGastos(data);
      } catch (err) {
        console.error("Error al obtener gastos:", err);
        setError("Error al obtener gastos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredGastos = gastos.filter((gasto) => {
    if (!startDate && !endDate) return true;
    const date = new Date(gasto.Fecha);
    if (startDate && endDate) {
      return date >= new Date(startDate) && date <= new Date(endDate);
    }
    if (startDate) return date >= new Date(startDate);
    if (endDate) return date <= new Date(endDate);
    return true;
  });

  const exportToExcel = () => {
    const wsData = [
      ["ID", "Fecha", "Categoría", "Descripción", "Monto", "Factura", "Proveedor", "EmpresaID"]
    ];
    filteredGastos.forEach(g => {
      wsData.push([
        g.ID,
        g.Fecha?.split("T")[0] || "",
        g.Categoria,
        g.Descripcion,
        g.Monto,
        g.Factura || "-",
        g.Proveedor || "-",
        g.EmpresaID
      ]);
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Gastos");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "gastos.xlsx");
  };

  const gastosMensuales = [
    { mes: "Ene", monto: 2000 },
    { mes: "Feb", monto: 1500 },
    { mes: "Mar", monto: 3000 }
  ];
  const pieColors = ["#4ade80", "#22d3ee", "#fbbf24", "#ef4444"];

  return (
    <Container fluid className="presupuesto-dashboard">
      <h3>Resumen de Presupuesto</h3>
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="filters-container mb-4">
        <Col md={3}>
          <Form.Group controlId="startDate">
            <Form.Label>Fecha Inicio</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="endDate">
            <Form.Label>Fecha Fin</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={3} className="d-flex align-items-end">
          <Button onClick={exportToExcel}>Exportar a Excel</Button>
        </Col>
      </Row>

      {loading ? (
        <div className="loading-wrap">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="mb-4">
            <h5>
              Total Gastado: $
              {filteredGastos.reduce((sum, g) => sum + Number(g.Monto), 0)}
            </h5>
          </div>
          <Row className="mb-4">
            <Col md={6}>
              <h5>Gastos Mensuales</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={gastosMensuales}>
                  <XAxis dataKey="mes" stroke="#f8f9fa" />
                  <YAxis stroke="#f8f9fa" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#495057", border: "none" }}
                    labelStyle={{ color: "#f8f9fa" }}
                  />
                  <Bar dataKey="monto" fill="var(--accent-color)" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
            <Col md={6}>
              <h5>Gastos por Categoría</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={filteredGastos}
                    dataKey="Monto"
                    nameKey="Categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {filteredGastos.map((entry, idx) => (
                      <Cell key={idx} fill={pieColors[idx % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#495057", border: "none" }}
                    labelStyle={{ color: "#f8f9fa" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Col>
          </Row>
          <h5>Listado de Gastos</h5>
          <Table striped hover responsive variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Factura</th>
                <th>Proveedor</th>
                <th>EmpresaID</th>
              </tr>
            </thead>
            <tbody>
              {filteredGastos.map((g) => (
                <tr key={g.ID}>
                  <td>{g.ID}</td>
                  <td>{g.Fecha?.split("T")[0]}</td>
                  <td>{g.Categoria}</td>
                  <td>{g.Descripcion}</td>
                  <td>${g.Monto}</td>
                  <td>{g.Factura || "-"}</td>
                  <td>{g.Proveedor || "-"}</td>
                  <td>{g.EmpresaID}</td>
                </tr>
              ))}
              {filteredGastos.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center">
                    No hay gastos en este rango.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default PresupuestoDashboard;
