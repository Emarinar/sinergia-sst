// frontend/src/components/Auditorias/AuditoriasInformes.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Form,
  Button,
  Spinner,
  Alert
} from 'react-bootstrap';
import {
  getEstadisticas,
  getInformeDetalle
} from '../../services/auditoriasService';
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
} from 'recharts';
import './Auditorias.css';

const AudInformes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [detalle, setDetalle] = useState([]);
  const [rango, setRango] = useState({ fechaInicio: '', fechaFin: '' });

  useEffect(() => {
    // Carga inicial sin filtro
    cargarInformes();
  }, []);

  const cargarInformes = async () => {
    setLoading(true);
    setError('');
    try {
      const [resStats, resDetalle] = await Promise.all([
        getEstadisticas(rango),
        getInformeDetalle(rango)
      ]);
      setStats(resStats.data);
      setDetalle(resDetalle.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los informes.');
    } finally {
      setLoading(false);
    }
  };

  // Colores para gráficos
  const pieColors = ['#4ade80', '#22d3ee', '#fbbf24', '#ef4444'];

  return (
    <Container className="auditorias-container mt-4">
      <h3>Informes de Auditorías</h3>
      <Form className="mb-4" onSubmit={e => { e.preventDefault(); cargarInformes(); }}>
        <Row>
          <Col md={3}>
            <Form.Group controlId="fi">
              <Form.Label>Fecha Inicio</Form.Label>
              <Form.Control
                type="date"
                value={rango.fechaInicio}
                onChange={e => setRango({ ...rango, fechaInicio: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="ff">
              <Form.Label>Fecha Fin</Form.Label>
              <Form.Control
                type="date"
                value={rango.fechaFin}
                onChange={e => setRango({ ...rango, fechaFin: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button type="submit" variant="primary">Filtrar</Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : stats && (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="shadow-sm text-center p-3">
                <h5>Total Auditorías</h5>
                <h2>{stats.total}</h2>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm text-center p-3">
                <h5>Concluidas</h5>
                <h2>{stats.concluidas}</h2>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="shadow-sm text-center p-3">
                <h5>Pendientes</h5>
                <h2>{stats.pendientes}</h2>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h6>Auditorías por Estado</h6>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Pendientes', value: stats.pendientes },
                      { name: 'En Proceso', value: stats.enProceso },
                      { name: 'Concluidas', value: stats.concluidas }
                    ]}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    label
                  >
                    {[
                      stats.pendientes,
                      stats.enProceso,
                      stats.concluidas
                    ].map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Col>
            <Col md={6}>
              <h6>Auditorías Mensuales</h6>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.porMes}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill={pieColors[0]} />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>

          <h6 className="mt-4">Detalle de Auditorías</h6>
          <Table striped hover responsive className="shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {detalle.map(a => (
                <tr key={a.ID}>
                  <td>{a.ID}</td>
                  <td>{new Date(a.Fecha).toLocaleDateString()}</td>
                  <td>{a.Responsable}</td>
                  <td>{a.Estado}</td>
                  <td>{new Date(a.CreatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {detalle.length === 0 && (
                <tr><td colSpan="5" className="text-center">— Sin resultados —</td></tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default AudInformes;
