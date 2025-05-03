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
  InputGroup,
  FormControl,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { FaCheck, FaTimes } from "react-icons/fa";
import "./Documentos.css";

const Documentos = () => {
  // Estados para documentos generales
  const [documentos, setDocumentos] = useState([]);
  const [archivo, setArchivo] = useState(null);
  const [errorDoc, setErrorDoc] = useState("");
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [searchDoc, setSearchDoc] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Estados para Documentos Empleados
  const [companyList, setCompanyList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employeeDocFile, setEmployeeDocFile] = useState(null);
  const [employeeDocs, setEmployeeDocs] = useState([]);
  const [errorEmployeeDoc, setErrorEmployeeDoc] = useState("");
  const [loadingEmployeeDoc, setLoadingEmployeeDoc] = useState(false);

  // Estados para Documentos Plantillas
  const [plantillas, setPlantillas] = useState([]);
  const [searchPlantillas, setSearchPlantillas] = useState("");

  useEffect(() => {
    fetchDocumentos();
    fetchCompanyList();
    fetchPlantillas();
  }, []);

  const fetchDocumentos = async () => {
    try {
      setLoadingDoc(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/documentos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocumentos(res.data);
      setLoadingDoc(false);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      setErrorDoc("Error al obtener documentos.");
      setLoadingDoc(false);
    }
  };

  const fetchCompanyList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/empresas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyList(res.data);
    } catch (error) {
      console.error("Error al obtener empresas:", error);
    }
  };

  const fetchEmployeesByCompany = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/empleados?empresaId=${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeList(res.data);
    } catch (error) {
      console.error("Error al obtener empleados por empresa:", error);
    }
  };

  const fetchEmployeeDocs = async (employeeId) => {
    try {
      setLoadingEmployeeDoc(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/empleados/documentos/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployeeDocs(res.data);
      setLoadingEmployeeDoc(false);
    } catch (error) {
      console.error("Error al obtener documentos del empleado:", error);
      setErrorEmployeeDoc("Error al obtener documentos del empleado.");
      setLoadingEmployeeDoc(false);
    }
  };

  const fetchPlantillas = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/plantillas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlantillas(res.data);
    } catch (error) {
      console.error("Error al obtener plantillas:", error);
    }
  };

  // Manejo de archivos para documentos generales
  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!archivo) {
      setErrorDoc("Por favor, selecciona un archivo.");
      return;
    }
    try {
      setLoadingDoc(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("archivo", archivo);
      const res = await axios.post("http://localhost:5000/api/documentos/subir", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setDocumentos([...documentos, res.data.documento]);
      setArchivo(null);
      setErrorDoc("");
      setLoadingDoc(false);
    } catch (err) {
      console.error("Error al subir archivo:", err);
      setErrorDoc("Error al subir el archivo.");
      setLoadingDoc(false);
    }
  };

  const handlePreview = (doc) => {
    if (!doc.Ruta) return;
    const ruta = doc.Ruta.startsWith("/") ? doc.Ruta : "/" + doc.Ruta;
    setPreviewUrl(ruta);
    setPreviewContent("");
    setShowPreview(true);
  };

  const handlePreviewPlantilla = (pl) => {
    if (!pl.Contenido) return;
    setPreviewContent(pl.Contenido);
    setPreviewUrl("");
    setShowPreview(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/documentos/eliminar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocumentos(documentos.filter((doc) => doc.ID !== id));
    } catch (error) {
      console.error("Error al eliminar documento:", error);
    }
  };

  const handleApproveDocument = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/documentos/aprobar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocumentos(documentos.map(doc => doc.ID === id ? { ...doc, estado: "aprobado" } : doc));
    } catch (error) {
      console.error("Error al aprobar documento:", error);
    }
  };

  const handleRejectDocument = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/documentos/rechazar/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocumentos(documentos.map(doc => doc.ID === id ? { ...doc, estado: "rechazado" } : doc));
    } catch (error) {
      console.error("Error al rechazar documento:", error);
    }
  };

  // Funciones para documentos de empleados
  const handleEmployeeDocFileChange = (e) => {
    setEmployeeDocFile(e.target.files[0]);
  };

  const handleCompanySelection = (e) => {
    const compId = e.target.value;
    setSelectedCompany(compId);
    setSelectedEmployee("");
    setEmployeeDocs([]);
    if (compId) {
      fetchEmployeesByCompany(compId);
    } else {
      setEmployeeList([]);
    }
  };

  const handleEmployeeSelection = (e) => {
    const empId = e.target.value;
    setSelectedEmployee(empId);
    if (empId) {
      fetchEmployeeDocs(empId);
    } else {
      setEmployeeDocs([]);
    }
  };

  const handleEmployeeDocUpload = async (e) => {
    e.preventDefault();
    if (!selectedCompany) {
      setErrorEmployeeDoc("Selecciona una empresa.");
      return;
    }
    if (!selectedEmployee) {
      setErrorEmployeeDoc("Selecciona un empleado.");
      return;
    }
    if (!employeeDocFile) {
      setErrorEmployeeDoc("Selecciona un archivo para subir.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("archivo", employeeDocFile);
      formData.append("employeeId", selectedEmployee);
      const res = await axios.post("http://localhost:5000/api/empleados/documentos", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setEmployeeDocs([...employeeDocs, res.data.documento]);
      setEmployeeDocFile(null);
      setErrorEmployeeDoc("");
    } catch (error) {
      console.error("Error al subir documento del empleado:", error);
      setErrorEmployeeDoc("Error al subir documento del empleado.");
    }
  };

  // Filtrado para documentos generales
  const filteredDocs = documentos.filter((doc) =>
    doc.Nombre ? doc.Nombre.toLowerCase().includes(searchDoc.toLowerCase()) : false
  );

  // Filtrado para plantillas
  const filteredPlantillas = plantillas.filter((pl) =>
    pl.Nombre ? pl.Nombre.toLowerCase().includes(searchPlantillas.toLowerCase()) : false
  );

  // Función auxiliar para obtener el nombre de la empresa a partir de su ID
  const getCompanyName = (id) => {
    const comp = companyList.find((c) => c.ID === id);
    return comp ? comp.Nombre : id;
  };

  return (
    <Container className="mt-4 documentos-container">
      <h2>Documentos</h2>
      <Tabs defaultActiveKey="documentos" id="documentos-tabs" className="mb-3">
        <Tab eventKey="documentos" title="Documentos">
          <Form onSubmit={handleUpload} className="mb-4">
            {errorDoc && <Alert variant="danger">{errorDoc}</Alert>}
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Subir documento general</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loadingDoc}>
              {loadingDoc ? "Subiendo..." : "Subir"}
            </Button>
          </Form>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Buscar documento..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
            />
          </InputGroup>
          {filteredDocs.length === 0 ? (
            <p>No hay documentos generales.</p>
          ) : (
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.ID}>
                    <td>{doc.ID}</td>
                    <td>{doc.Nombre}</td>
                    <td>{doc.Tipo}</td>
                    <td>
                      {doc.estado === "aprobado" ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : doc.estado === "rechazado" ? (
                        <FaTimes style={{ color: "red" }} />
                      ) : (
                        "Pendiente"
                      )}
                    </td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => handlePreview(doc)}>
                        Vista Previa
                      </Button>
                      <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(doc.ID)}>
                        Eliminar
                      </Button>
                      <Button variant="success" size="sm" className="me-2" onClick={() => handleApproveDocument(doc.ID)}>
                        <FaCheck />
                      </Button>
                      <Button variant="danger" size="sm" className="me-2" onClick={() => handleRejectDocument(doc.ID)}>
                        <FaTimes />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="documentos-empleados" title="Documentos Empleados">
          <h5 className="mb-3">Subir Documentación del Empleado</h5>
          {errorEmployeeDoc && <Alert variant="danger">{errorEmployeeDoc}</Alert>}
          <Form onSubmit={handleEmployeeDocUpload} className="mb-4">
            <Form.Group className="mb-3" controlId="companySelect">
              <Form.Label>Empresa</Form.Label>
              <Form.Select value={selectedCompany} onChange={handleCompanySelection} required>
                <option value="">Seleccione una empresa</option>
                {companyList.map((comp) => (
                  <option key={comp.ID} value={comp.ID}>
                    {comp.Nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="employeeSelect">
              <Form.Label>Empleado</Form.Label>
              <Form.Select value={selectedEmployee} onChange={handleEmployeeSelection} required>
                <option value="">Seleccione un empleado</option>
                {employeeList.map((emp) => (
                  <option key={emp.ID} value={emp.ID}>
                    {emp.Nombre} - {emp.Correo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="employeeDocFile">
              <Form.Label>Archivo</Form.Label>
              <Form.Control type="file" onChange={handleEmployeeDocFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Subir Documento
            </Button>
          </Form>
          <h5 className="mb-3">Documentación del Empleado</h5>
          {loadingEmployeeDoc ? (
            <Spinner animation="border" variant="primary" />
          ) : employeeDocs.length === 0 ? (
            <p>No hay documentos para este empleado.</p>
          ) : (
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {employeeDocs.map((doc) => (
                  <tr key={doc.ID}>
                    <td>{doc.ID}</td>
                    <td>{doc.Nombre}</td>
                    <td>{doc.Tipo}</td>
                    <td>
                      {doc.estado === "aprobado" ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : doc.estado === "rechazado" ? (
                        <FaTimes style={{ color: "red" }} />
                      ) : (
                        "Pendiente"
                      )}
                    </td>
                    <td>
                      <Button variant="info" size="sm" className="me-2" onClick={() => handlePreview(doc)}>
                        Vista Previa
                      </Button>
                      <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(doc.ID)}>
                        Eliminar
                      </Button>
                      <Button variant="success" size="sm" className="me-2" onClick={() => handleApproveDocument(doc.ID)}>
                        <FaCheck />
                      </Button>
                      <Button variant="danger" size="sm" className="me-2" onClick={() => handleRejectDocument(doc.ID)}>
                        <FaTimes />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="documentos-plantillas" title="Documentos Plantillas">
          <h5 className="mb-3">Plantillas SST</h5>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Buscar plantilla..."
              value={searchPlantillas}
              onChange={(e) => setSearchPlantillas(e.target.value)}
            />
          </InputGroup>
          {filteredPlantillas.length === 0 ? (
            <p>No hay plantillas registradas.</p>
          ) : (
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlantillas.map((pl) => (
                  <tr key={pl.ID}>
                    <td>{pl.ID}</td>
                    <td>{pl.Nombre}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handlePreviewPlantilla(pl)}>
                        Vista Previa
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>

      {/* Modal para vista previa */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vista Previa del Documento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {previewContent ? (
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
          ) : (
            <iframe
              src={"http://localhost:5000" + previewUrl}
              title="Vista Previa"
              style={{ width: "100%", height: "500px", border: "none" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Documentos;
