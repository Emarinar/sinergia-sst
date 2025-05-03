// frontend/src/components/Auditorias/AuditoriasSeguimiento.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Row,
  Col,
  InputGroup,
  FormControl,
  Spinner
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  getAcciones,
  createAccion,
  updateAccion,
  deleteAccion
} from "../../services/auditoriasService";
import "./Auditorias.css";

const AuditoriasSeguimiento = ({ auditoriaId: propAuditoriaId }) => {
  // Si no te llega como prop, lo sacamos de la URL
  const { auditoriaId: urlAuditoriaId } = useParams();
  const auditoriaId = propAuditoriaId || urlAuditoriaId;

  const [acciones, setAcciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal & form
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    id: null,
    descripcion: "",
    responsable: "",
    fechaVencimiento: "",
    prioridad: "Media",
    estado: "Pendiente"
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (auditoriaId) loadAcciones();
  }, [auditoriaId]);

  const loadAcciones = async () => {
    setLoading(true);
    try {
      const res = await getAcciones(auditoriaId);
      setAcciones(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las acciones.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = acciones.filter(a =>
    [a.Descripcion, a.Responsable, a.Prioridad, a.Estado]
      .some(field => field?.toLowerCase().includes(search.toLowerCase()))
  );

  const openModal = (accion = null) => {
    if (accion) {
      setIsEditing(true);
      setForm({
        id: accion.ID,
        descripcion: accion.Descripcion,
        responsable: accion.Responsable,
        fechaVencimiento: accion.FechaVencimiento?.substring(0, 10) || "",
        prioridad: accion.Prioridad,
        estado: accion.Estado
      });
    } else {
      setIsEditing(false);
      setForm({
        id: null,
        descripcion: "",
        responsable: "",
        fechaVencimiento: "",
        prioridad: "Media",
        estado: "Pendiente"
      });
    }
    setFormError("");
    setShowModal(true);
  };

  const saveAccion = async e => {
    e.preventDefault();
    const { descripcion, responsable, fechaVencimiento } = form;
    if (!descripcion || !responsable || !fechaVencimiento) {
      return setFormError("Descripción, responsable y fecha de vencimiento son obligatorios.");
    }
    try {
      if (isEditing) {
        // updateAccion ahora recibe (auditoriaId, accionId, data)
        await updateAccion(auditoriaId, form.id, form);
      } else {
        // createAccion recibe (auditoriaId, data)
        await createAccion(auditoriaId, form);
      }
      setShowModal(false);
      loadAcciones();
    } catch (err) {
      console.error(err);
      setFormError("Error al guardar la acción.");
    }
  };

  const handleDelete = async id => {
    if (!window.confirm("¿Eliminar esta acción?")) return;
    try {
      // deleteAccion recibe (auditoriaId, accionId)
      await deleteAccion(auditoriaId, id);
      loadAcciones();
    } catch (err) {
      console.error(err);
      setError("Error al eliminar la acción.");
    }
  };

  return (
    <Container className="auditorias-container mt-4">
      <Row className="align-items-center mb-3">
        <Col><h3>Seguimiento de Acciones</h3></Col>
        <Col md="5">
          <InputGroup>
            <FormControl
              placeholder="Buscar descripción, responsable, estado..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => openModal()}>
            + Nueva Acción
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <Table striped hover responsive className="mb-0 shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Descripción</th>
              <th>Responsable</th>
              <th>Vencimiento</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.ID}>
                <td>{a.Descripcion}</td>
                <td>{a.Responsable}</td>
                <td>{new Date(a.FechaVencimiento).toLocaleDateString()}</td>
                <td>{a.Prioridad}</td>
                <td>{a.Estado}</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => openModal(a)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(a.ID)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center">— Sin resultados —</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Editar Acción" : "Nueva Acción"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={saveAccion}>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={form.descripcion}
                onChange={e => setForm({ ...form, descripcion: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Responsable</Form.Label>
              <Form.Control
                type="text"
                value={form.responsable}
                onChange={e => setForm({ ...form, responsable: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Vencimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.fechaVencimiento}
                    onChange={e => setForm({ ...form, fechaVencimiento: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Prioridad</Form.Label>
                  <Form.Select
                    value={form.prioridad}
                    onChange={e => setForm({ ...form, prioridad: e.target.value })}
                  >
                    <option>Alta</option>
                    <option>Media</option>
                    <option>Baja</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}
              >
                <option>Pendiente</option>
                <option>En Proceso</option>
                <option>Completada</option>
              </Form.Select>
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

export default AuditoriasSeguimiento;
