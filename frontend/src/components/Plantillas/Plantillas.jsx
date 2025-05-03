// src/components/Plantillas/Plantillas.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  InputGroup,
  FormControl,
  Spinner,
  Row,
  Col,
  Tabs,
  Tab,
  ButtonGroup
} from "react-bootstrap";
import MyEditorDraft from "../MyEditorDraft";
import "./Plantillas.css";
import * as plantillaService from "../../services/plantillaService";

const Plantillas = () => {
  const [plantillas, setPlantillas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [mode, setMode] = useState("visual");
  const [current, setCurrent] = useState({
    id: "",
    nombre: "",
    contenido: "",
    logo: "",
    empresaID: ""
  });

  const [showPreview, setShowPreview] = useState(false);
  const [previewHTML, setPreviewHTML] = useState("");

  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [pdfResult, setPdfResult] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await plantillaService.getAll();
      setPlantillas(data);
      setError("");
    } catch {
      setError("No se pudieron cargar las plantillas.");
    } finally {
      setLoading(false);
    }
  };

  const openFormModal = (p = null) => {
    if (p) {
      setEditMode(true);
      setCurrent({
        id: p.ID,
        nombre: p.Nombre,
        contenido: p.Contenido,
        logo: p.Logo,
        empresaID: p.EmpresaID
      });
    } else {
      setEditMode(false);
      setCurrent({ id: "", nombre: "", contenido: "", logo: "", empresaID: "" });
    }
    setMode("visual");
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setCurrent({ id: "", nombre: "", contenido: "", logo: "", empresaID: "" });
  };

  const handleChange = (e) =>
    setCurrent({ ...current, [e.target.name]: e.target.value });

  const handleContentChange = (html) =>
    setCurrent({ ...current, contenido: html });

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        const updated = await plantillaService.update(current.id, current);
        setPlantillas((pl) =>
          pl.map((p) => (p.ID === updated.ID ? updated : p))
        );
      } else {
        const created = await plantillaService.create(current);
        setPlantillas((pl) => [...pl, created]);
      }
      closeFormModal();
    } catch {
      setError("Error al guardar plantilla.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar plantilla?")) return;
    try {
      await plantillaService.remove(id);
      setPlantillas((pl) => pl.filter((p) => p.ID !== id));
    } catch {
      setError("Error al eliminar plantilla.");
    }
  };

  const generarPDF = async (id) => {
    setGenerandoPDF(true);
    setPdfResult("");
    try {
      await plantillaService.generatePDF(id);
      setPdfResult("PDF generado con éxito.");
    } catch {
      setPdfResult("Error al generar PDF.");
    } finally {
      setGenerandoPDF(false);
    }
  };

  const openPreview = (contenido) => {
    const linkTag =
      '<link rel="stylesheet" href="http://localhost:5000/public/template.css" />';
    setPreviewHTML(
      `<html><head>${linkTag}</head><body>${contenido}</body></html>`
    );
    setShowPreview(true);
  };

  const filtered = plantillas.filter((p) =>
    p.Nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="plantillas-container mt-4">
      <Row className="mb-3 align-items-center">
        <Col><h2 className="section-title">Plantillas</h2></Col>
        <Col md="4">
          <InputGroup>
            <FormControl
              placeholder="Buscar plantilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => openFormModal()}>
            + Nueva
          </Button>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="loading-wrap">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table
          striped
          hover
          responsive
          variant="dark"
          className="plantillas-table"
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th style={{ width: "300px" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.ID}>
                <td>{p.ID}</td>
                <td>{p.Nombre}</td>
                <td>{p.EmpresaID}</td>
                <td className="actions-cell">
                  <ButtonGroup>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => openPreview(p.Contenido)}
                    >
                      Vista previa
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() => openFormModal(p)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => remove(p.ID)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => generarPDF(p.ID)}
                      disabled={generandoPDF}
                    >
                      {generandoPDF ? "..." : "PDF"}
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No hay plantillas que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {pdfResult && <Alert className="mt-3" variant="info">{pdfResult}</Alert>}

      {/* Modal de formulario */}
      <Modal
        show={showFormModal}
        onHide={closeFormModal}
        size="lg"
        mountOnEnter
        unmountOnExit
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Editar Plantilla" : "Crear Plantilla"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={save}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={current.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Tabs
              activeKey={mode}
              onSelect={(k) => setMode(k)}
              className="mb-3"
            >
              <Tab eventKey="visual" title="Visual">
                {showFormModal && (
                  <MyEditorDraft
                    initialContent={current.contenido}
                    onContentChange={handleContentChange}
                  />
                )}
              </Tab>
              <Tab eventKey="html" title="HTML">
                <Form.Control
                  as="textarea"
                  rows={8}
                  value={current.contenido}
                  onChange={(e) =>
                    setCurrent({ ...current, contenido: e.target.value })
                  }
                />
              </Tab>
            </Tabs>

            <Form.Group className="mb-3">
              <Form.Label>Logo (URL)</Form.Label>
              <Form.Control
                name="logo"
                value={current.logo}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ID Empresa</Form.Label>
              <Form.Control
                type="number"
                name="empresaID"
                value={current.empresaID}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="text-end">
              <Button type="submit" variant="primary">
                {editMode ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de vista previa */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="xl"
        mountOnEnter
        unmountOnExit
      >
        <Modal.Header closeButton>
          <Modal.Title>Vista previa de plantilla</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: "80vh", padding: 0 }}>
          <iframe
            title="Vista previa"
            srcDoc={previewHTML}
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Plantillas;
