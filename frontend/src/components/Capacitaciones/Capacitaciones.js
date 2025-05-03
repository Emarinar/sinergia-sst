import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

// Módulo de Capacitaciones
const Capacitaciones = () => {
  // Estados para la sección de capacitaciones (Listado)
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [showCapModal, setShowCapModal] = useState(false);
  const [isEditingCap, setIsEditingCap] = useState(false);
  const [capForm, setCapForm] = useState({
    id: "",
    titulo: "",
    fecha: "",
    descripcion: "",
    lugar: "",
  });
  const [capFormError, setCapFormError] = useState("");

  // Estados para la Plataforma de Estudio
  const [studyPrograms, setStudyPrograms] = useState([]);
  const [showStudyModal, setShowStudyModal] = useState(false);
  const [studyForm, setStudyForm] = useState({
    id: "",
    titulo: "",
    descripcion: "",
    // 'grade' se asignará por el administrador
    grade: "",
  });
  const [studyFormError, setStudyFormError] = useState("");
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Estado para mensajes de recordatorio (para capacitaciones)
  const [reminderMessage, setReminderMessage] = useState("");

  // Cargar capacitaciones y programas de estudio de la API al iniciar
  useEffect(() => {
    const fetchCapacitaciones = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/capacitaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCapacitaciones(res.data);
      } catch (error) {
        console.error("Error al obtener capacitaciones:", error);
      }
    };
    const fetchStudyPrograms = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/study-programs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudyPrograms(res.data);
      } catch (error) {
        console.error("Error al obtener programas de estudio:", error);
      }
    };
    fetchCapacitaciones();
    fetchStudyPrograms();
  }, []);

  // Funciones para Capacitaciones (Listado)
  const handleShowCapModal = (cap = null) => {
    if (cap) {
      setIsEditingCap(true);
      setCapForm({
        id: cap.id,
        titulo: cap.titulo,
        fecha: cap.fecha,
        descripcion: cap.descripcion,
        lugar: cap.lugar,
      });
    } else {
      setIsEditingCap(false);
      setCapForm({ id: "", titulo: "", fecha: "", descripcion: "", lugar: "" });
    }
    setCapFormError("");
    setShowCapModal(true);
  };

  const handleCloseCapModal = () => {
    setShowCapModal(false);
    setCapForm({ id: "", titulo: "", fecha: "", descripcion: "", lugar: "" });
    setCapFormError("");
    setIsEditingCap(false);
  };

  const handleCapFormChange = (e) => {
    setCapForm({ ...capForm, [e.target.name]: e.target.value });
  };

  const handleCapFormSubmit = async (e) => {
    e.preventDefault();
    if (!capForm.titulo || !capForm.fecha || !capForm.descripcion || !capForm.lugar) {
      setCapFormError("Todos los campos son obligatorios.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (isEditingCap) {
        const res = await axios.put(
          `http://localhost:5000/api/capacitaciones/${capForm.id}`,
          capForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCapacitaciones(
          capacitaciones.map((cap) =>
            cap.id === capForm.id ? res.data.capacitacion : cap
          )
        );
      } else {
        const res = await axios.post("http://localhost:5000/api/capacitaciones", capForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCapacitaciones([...capacitaciones, res.data.capacitacion]);
      }
      handleCloseCapModal();
    } catch (error) {
      console.error("Error al guardar capacitación:", error);
      setCapFormError("Error al guardar la capacitación.");
    }
  };

  const sendReminder = (capId) => {
    setReminderMessage(`Recordatorio enviado para la capacitación ID ${capId}`);
    setTimeout(() => setReminderMessage(""), 3000);
  };

  const generateCertificate = (capId) => {
    alert(`Certificado generado para la capacitación ID ${capId}`);
  };

  // Funciones para la Plataforma de Estudio
  const handleShowStudyModal = () => {
    setStudyForm({ id: "", titulo: "", descripcion: "", grade: "" });
    setStudyFormError("");
    setShowStudyModal(true);
  };

  const handleCloseStudyModal = () => {
    setStudyForm({ id: "", titulo: "", descripcion: "", grade: "" });
    setStudyFormError("");
    setShowStudyModal(false);
  };

  const handleStudyFormChange = (e) => {
    setStudyForm({ ...studyForm, [e.target.name]: e.target.value });
  };

  const handleStudyFormSubmit = async (e) => {
    e.preventDefault();
    if (!studyForm.titulo || !studyForm.descripcion) {
      setStudyFormError("Título y descripción son obligatorios.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/study-programs", studyForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudyPrograms([...studyPrograms, res.data.programa]);
      handleCloseStudyModal();
    } catch (error) {
      console.error("Error al agregar programa de estudio:", error);
      setStudyFormError("Error al agregar el programa.");
    }
  };

  // Función para calificar un programa de estudio
  const handleShowGradeModal = (program) => {
    setSelectedProgram(program);
    setShowGradeModal(true);
  };

  const handleCloseGradeModal = () => {
    setSelectedProgram(null);
    setShowGradeModal(false);
  };

  const handleGradeChange = (e) => {
    setSelectedProgram({ ...selectedProgram, grade: e.target.value });
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/study-programs/${selectedProgram.id}`,
        { grade: selectedProgram.grade },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStudyPrograms(
        studyPrograms.map((prog) =>
          prog.id === selectedProgram.id ? res.data.programa : prog
        )
      );
      handleCloseGradeModal();
    } catch (error) {
      console.error("Error al calificar programa:", error);
    }
  };

  // Renderizado de la vista previa de programas de estudio
  const renderStudyPrograms = () => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Calificación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {studyPrograms.map((prog) => (
          <tr key={prog.id}>
            <td>{prog.id}</td>
            <td>{prog.titulo}</td>
            <td>{prog.descripcion}</td>
            <td>{prog.grade ? prog.grade : "No calificado"}</td>
            <td>
              <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowGradeModal(prog)}>
                Calificar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Container className="mt-4">
      <h2>Capacitaciones</h2>
      <Tabs defaultActiveKey="listado" id="capacitaciones-tabs" className="mb-3">
        {/* Tab 1: Listado de Capacitaciones */}
        <Tab eventKey="listado" title="Listado">
          <Button variant="primary" className="mb-3" onClick={() => handleShowCapModal()}>
            Programar Nueva Capacitación
          </Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Fecha</th>
                <th>Lugar</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {capacitaciones.map((cap) => (
                <tr key={cap.id}>
                  <td>{cap.id}</td>
                  <td>{cap.titulo}</td>
                  <td>{cap.fecha}</td>
                  <td>{cap.lugar}</td>
                  <td>
                    <Button variant="info" size="sm" className="me-2" onClick={() => handleShowCapModal(cap)}>
                      Editar
                    </Button>
                    <Button variant="secondary" size="sm" className="me-2" onClick={() => sendReminder(cap.id)}>
                      Recordatorio
                    </Button>
                    <Button variant="success" size="sm" onClick={() => generateCertificate(cap.id)}>
                      Certificado
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* Tab 2: Calendario */}
        <Tab eventKey="calendario" title="Calendario">
          <Card className="p-4">
            <Card.Body>
              <Card.Title>Calendario de Capacitaciones</Card.Title>
              <Card.Text>
                [Aquí se integrará un calendario interactivo para visualizar las capacitaciones programadas.]
              </Card.Text>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab 3: Plataforma de Estudio */}
        <Tab eventKey="plataforma" title="Plataforma de Estudio">
          <Button variant="primary" className="mb-3" onClick={handleShowStudyModal}>
            Agregar Programa de Estudio
          </Button>
          {renderStudyPrograms()}
        </Tab>

        {/* Tab 4: Videos */}
        <Tab eventKey="videos" title="Videos">
          <Card className="p-4">
            <Card.Body>
              <Card.Title>Videos de Capacitación</Card.Title>
              <Card.Text>
                Espacio para reproducir videos de capacitación.
              </Card.Text>
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://youtube.com/playlist?list=PL5p9H3Q-yosmAa9NM64z2oycmPwZnAsCh&si=wVIgX8FHo8ZngSxq"
                  title="Video de Capacitación"
                  allowFullScreen
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab 5: Asistencia y Certificado */}
        <Tab eventKey="asistencia" title="Asistencia y Certificado">
          <Card className="p-4">
            <Card.Body>
              <Card.Title>Registro de Asistencia</Card.Title>
              <Card.Text>
                Permite firmar el listado de asistencia y generar un certificado firmado digitalmente por Sinergia Consultoria.
              </Card.Text>
              <Button variant="outline-success" className="me-2">
                Firmar Asistencia
              </Button>
              <Button variant="outline-primary">
                Generar Certificado
              </Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal para agregar/editar capacitación */}
      <Modal show={showCapModal} onHide={handleCloseCapModal}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditingCap ? "Editar Capacitación" : "Programar Nueva Capacitación"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {capFormError && <Alert variant="danger">{capFormError}</Alert>}
          <Form onSubmit={handleCapFormSubmit}>
            <Form.Group className="mb-3" controlId="formTituloCap">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Título de la capacitación"
                name="titulo"
                value={capForm.titulo}
                onChange={handleCapFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formFechaCap">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={capForm.fecha}
                onChange={handleCapFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLugarCap">
              <Form.Label>Lugar</Form.Label>
              <Form.Control
                type="text"
                placeholder="Lugar de la capacitación"
                name="lugar"
                value={capForm.lugar}
                onChange={handleCapFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcionCap">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descripción de la capacitación"
                name="descripcion"
                value={capForm.descripcion}
                onChange={handleCapFormChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEditingCap ? "Actualizar" : "Programar"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para agregar un programa de estudio */}
      <Modal show={showStudyModal} onHide={handleCloseStudyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Programa de Estudio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {studyFormError && <Alert variant="danger">{studyFormError}</Alert>}
          <Form onSubmit={handleStudyFormSubmit}>
            <Form.Group className="mb-3" controlId="formTituloEstudio">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                placeholder="Título del programa"
                name="titulo"
                value={studyForm.titulo}
                onChange={handleStudyFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDescripcionEstudio">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descripción del programa"
                name="descripcion"
                value={studyForm.descripcion}
                onChange={handleStudyFormChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Agregar Programa
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para calificar un programa de estudio */}
      <Modal show={showGradeModal} onHide={handleCloseGradeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Calificar Programa de Estudio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProgram && (
            <Form onSubmit={handleGradeSubmit}>
              <Form.Group className="mb-3" controlId="formGrade">
                <Form.Label>Calificación</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingresa la calificación"
                  value={selectedProgram.grade || ""}
                  onChange={handleGradeChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Guardar Calificación
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {reminderMessage && <Alert variant="info" className="mt-3">{reminderMessage}</Alert>}
    </Container>
  );
};

export default Capacitaciones;
