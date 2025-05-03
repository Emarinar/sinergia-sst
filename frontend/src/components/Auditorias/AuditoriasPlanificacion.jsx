import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  FormControl,
  Spinner
} from "react-bootstrap";
import auditoriasService from "../../services/auditoriasService";
import "../Auditorias/Auditorias.css";

const AuditoriasPlanificacion = () => {
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: null, alcance: "", periodicidad: "", criterios: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    loadPlanes();
  }, []);

  const loadPlanes = async () => {
    setLoading(true);
    try {
      const res = await auditoriasService.getPlanes();
      setPlanes(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los planes.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = planes.filter(p =>
    (p.Alcance || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.Periodicidad || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.Criterios || "").toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (plan = null) => {
    if (plan) {
      setIsEditing(true);
      setForm({
        id: plan.ID,
        alcance: plan.Alcance || "",
        periodicidad: plan.Periodicidad || "",
        criterios: plan.Criterios || ""
      });
    } else {
      setIsEditing(false);
      setForm({ id: null, alcance: "", periodicidad: "", criterios: "" });
    }
    setFormError("");
    setShowModal(true);
  };

  const savePlan = async e => {
    e.preventDefault();
    if (!form.alcance || !form.periodicidad || !form.criterios) {
      return setFormError("Todos los campos son obligatorios.");
    }
    try {
      let res;
      if (isEditing) {
        res = await auditoriasService.updatePlan(form.id, form);
        setPlanes(planes.map(p => p.ID === form.id ? res.data : p));
      } else {
        res = await auditoriasService.createPlan(form);
        setPlanes([res.data, ...planes]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setFormError("Error al guardar el plan.");
    }
  };

  return (
    <Container className="auditorias-container mt-4">
      <Row className="align-items-center mb-3">
        <Col><h3>Planificación de Auditorías</h3></Col>
        <Col md="6">
          <InputGroup>
            <FormControl
              placeholder="Buscar alcance, periodicidad o criterios..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => openModal()}>
            + Nuevo Plan
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading
        ? <div className="text-center"><Spinner animation="border" /></div>
        : (
          <Card className="mb-4 shadow-sm">
            <Table striped hover responsive className="mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Alcance</th>
                  <th>Periodicidad</th>
                  <th>Criterios</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(plan => (
                  <tr key={plan.ID}>
                    <td>{plan.Alcance}</td>
                    <td>{plan.Periodicidad}</td>
                    <td>{plan.Criterios}</td>
                    <td>{new Date(plan.CreatedAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-2"
                        onClick={() => openModal(plan)}
                      >Editar</Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={async () => {
                          await auditoriasService.deletePlan(plan.ID);
                          setPlanes(planes.filter(p => p.ID !== plan.ID));
                        }}
                      >Eliminar</Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="5" className="text-center">— Sin resultados —</td></tr>
                )}
              </tbody>
            </Table>
          </Card>
        )
      }

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Plan" : "Nuevo Plan"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={savePlan}>
            <Form.Group className="mb-3">
              <Form.Label>Alcance</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="alcance"
                value={form.alcance}
                onChange={e => setForm({ ...form, alcance: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Periodicidad</Form.Label>
              <Form.Control
                type="text"
                name="periodicidad"
                value={form.periodicidad}
                onChange={e => setForm({ ...form, periodicidad: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Criterios y Normas</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="criterios"
                value={form.criterios}
                onChange={e => setForm({ ...form, criterios: e.target.value })}
              />
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AuditoriasPlanificacion;
