// src/components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Spinner, Alert, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { FaBuilding, FaUsers, FaFileAlt } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  // Estados para guardar los datos de reportes
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Datos para los gráficos (puedes ajustarlos según la respuesta real de la API)
  const [empleadosData, setEmpleadosData] = useState([]);
  const [documentosData, setDocumentosData] = useState([]);

  // Configuración de animación para contenedores
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, when: "beforeChildren", staggerChildren: 0.2 },
    },
  };

  // Colores para el gráfico de pastel
  const pieColors = ["#4ade80", "#22d3ee", "#fbbf24", "#ef4444"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      // Llamamos a las rutas de reportes en paralelo
      const [empresasRes, empleadosRes, documentosRes] = await Promise.all([
        axios.get("http://localhost:5000/api/reportes/empresas", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/reportes/empleados", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/reportes/documentos", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // Actualizamos estados con los datos recibidos (asumiendo que el backend devuelve objetos con propiedades TotalEmpresas, etc.)
      setTotalEmpresas(empresasRes.data.TotalEmpresas || 0);
      setTotalEmpleados(empleadosRes.data.TotalEmpleados || 0);
      setTotalDocumentos(documentosRes.data.TotalDocumentos || 0);

      // Ejemplo de datos simulados para gráficos (ajusta según la respuesta real)
      setEmpleadosData([
        { company: "Empresa A", empleados: 25 },
        { company: "Empresa B", empleados: 15 },
        { company: "Empresa C", empleados: 30 },
      ]);
      setDocumentosData([
        { type: "PDF", value: 40 },
        { type: "Word", value: 20 },
        { type: "Excel", value: 15 },
        { type: "Otros", value: 25 },
      ]);

    } catch (err) {
      console.error("Error en Dashboard:", err);
      setError("Error al cargar los datos del dashboard.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container fluid className="py-4">
        <h1 className="text-center text-white mb-4">Resumen de SST</h1>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <Spinner animation="border" variant="light" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {/* Tarjetas de métricas */}
            <Row className="mb-5">
              <Col md={4} sm={12} className="mb-3">
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="text-center metric-card">
                    <Card.Body>
                      <FaBuilding className="metric-icon" />
                      <Card.Title>Empresas Registradas</Card.Title>
                      <Card.Text className="metric-value">{totalEmpresas}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              <Col md={4} sm={12} className="mb-3">
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="text-center metric-card">
                    <Card.Body>
                      <FaUsers className="metric-icon" />
                      <Card.Title>Total Empleados</Card.Title>
                      <Card.Text className="metric-value">{totalEmpleados}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              <Col md={4} sm={12} className="mb-3">
                <motion.div whileHover={{ scale: 1.03 }}>
                  <Card className="text-center metric-card">
                    <Card.Body>
                      <FaFileAlt className="metric-icon" />
                      <Card.Title>Total Documentos</Card.Title>
                      <Card.Text className="metric-value">{totalDocumentos}</Card.Text>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>

            {/* Gráficos */}
            <Row>
              <Col md={6} sm={12} className="mb-4">
                <Card className="metric-card">
                  <Card.Body>
                    <Card.Title className="text-center">Empleados por Empresa</Card.Title>
                    <div style={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <BarChart data={empleadosData}>
                          <XAxis dataKey="company" stroke="#fff" />
                          <YAxis stroke="#fff" />
                          <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} labelStyle={{ color: "#fff" }} />
                          <Bar dataKey="empleados" fill="#4ade80" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} sm={12} className="mb-4">
                <Card className="metric-card">
                  <Card.Body>
                    <Card.Title className="text-center">Documentos por Tipo</Card.Title>
                    <div style={{ width: "100%", height: 300 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={documentosData}
                            dataKey="value"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#4ade80"
                            label
                          >
                            {documentosData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} labelStyle={{ color: "#fff" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default Dashboard;
