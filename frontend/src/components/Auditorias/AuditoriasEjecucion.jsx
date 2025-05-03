import React, { useEffect, useState } from 'react';
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form
} from 'react-bootstrap';
import auditoriasService from '../../services/auditoriasService'; // ahora sí default
import '../Auditorias/Auditorias.css';

const AuditoriasEjecucion = () => {
  const [auditorias, setAuditorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para modal de edición/creación
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: null, fecha: '', responsable: '', estado: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadEjecuciones();
  }, []);

  const loadEjecuciones = async () => {
    setLoading(true);
    try {
      const res = await auditoriasService.getEjecuciones();
      setAuditorias(res.data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las auditorías en ejecución.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (aud = null) => {
    if (aud) {
      setIsEditing(true);
      setForm({
        id: aud.ID,
        fecha: aud.Fecha?.substring(0,10) || '',
        responsable: aud.Responsable,
        estado: aud.Estado
      });
    } else {
      setIsEditing(false);
      setForm({ id: null, fecha: '', responsable: '', estado: '' });
    }
    setFormError('');
    setShowModal(true);
  };

  const saveAuditoria = async e => {
    e.preventDefault();
    if (!form.fecha || !form.responsable || !form.estado) {
      return setFormError('Fecha, responsable y estado son obligatorios.');
    }
    try {
      let res;
      if (isEditing) {
        res = await auditoriasService.updatePlan(form.id, form); // ojo: si usas endpoint distinto, ajusta aquí
        setAuditorias(auditorias.map(a => (a.ID === form.id ? res.data : a)));
      } else {
        res = await auditoriasService.getPlanes(form); // para crear nuevo, ajusta si usas otro método
        setAuditorias([res.data, ...auditorias]);
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setFormError('Error al guardar la auditoría.');
    }
  };

  return (
    <Container className="auditorias-container mt-4">
      <h3>Auditorías en Ejecución</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Button variant="success" className="mb-3" onClick={() => openModal()}>
        + Nueva Auditoría
      </Button>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Responsable</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {auditorias.map(aud => (
              <tr key={aud.ID}>
                <td>{aud.ID}</td>
                <td>{aud.Fecha?.substring(0,10)}</td>
                <td>{aud.Responsable}</td>
                <td>{aud.Estado}</td>
                <td>
                  <Button size="sm" variant="warning" className="me-2" onClick={() => openModal(aud)}>
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Editar Auditoría' : 'Nueva Auditoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <Alert variant="danger">{formError}</Alert>}
          <Form onSubmit={saveAuditoria}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={form.fecha}
                onChange={e => setForm({ ...form, fecha: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Responsable</Form.Label>
              <Form.Control
                type="text"
                value={form.responsable}
                onChange={e => setForm({ ...form, responsable: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={form.estado}
                onChange={e => setForm({ ...form, estado: e.target.value })}
                required
              >
                <option value="">Seleccione</option>
                <option value="Pendiente">Pendiente</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Completada">Completada</option>
              </Form.Select>
            </Form.Group>
            <div className="d-grid">
              <Button type="submit" variant="primary">
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AuditoriasEjecucion;
