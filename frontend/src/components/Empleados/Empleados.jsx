// src/components/Empleados/Empleados.jsx
import React, { useState, useEffect } from "react";
import { 
  Container, 
  Table, 
  Form, 
  Button, 
  Alert, 
  Modal, 
  InputGroup, 
  FormControl, 
  Spinner, 
  Tabs, 
  Tab 
} from "react-bootstrap";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./Empleados.css";

// Constantes para validaciones y opciones de listas
const tiposDocumento = ["Nit", "Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte"];
const generos = ["Masculino", "Femenino", "Otro"];
const razas = ["Blanca", "Negra", "Mestiza", "Indígena", "Otra"];
const estadosCiviles = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"];
const mediosTransporte = ["Automóvil", "Motocicleta", "Bicicleta", "Transporte público", "A pie"];

const Empleados = () => {
  // Estados para empleados, empresas y carga/error
  const [empleados, setEmpleados] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Estados para filtros en la pestaña "Empleados por Empresa"
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Estados para modal y formulario (para agregar/editar)
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    cargo: "",
    empresaID: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    edad: "",
    genero: "",
    raza: "",
    estadoCivil: "",
    municipio: "",
    direccion: "",
    medioTransporte: "",
    celular: "",
    correo: "",
    contactoEmergencia: "",
    celularEmergencia: "",
  });

  useEffect(() => {
    fetchEmpleados();
    fetchCompanies();
  }, []);

  const fetchEmpleados = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/empleados", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener empleados:", err);
      setError("Error al cargar empleados.");
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/empresas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
    } catch (err) {
      console.error("Error al obtener empresas:", err);
      setError("Error al cargar empresas.");
    }
  };

  // Función para obtener el nombre de la empresa a partir del ID
  const getCompanyName = (id) => {
    const comp = companies.find((c) => c.ID === id);
    return comp ? comp.Nombre : id;
  };

  // Modal: Abrir para agregar o editar empleado
  const handleShowModal = (empleado = null) => {
    if (empleado) {
      setEditMode(true);
      setFormData({
        id: empleado.ID,
        nombre: empleado.Nombre,
        apellido: empleado.Apellido,
        cargo: empleado.Cargo,
        empresaID: empleado.EmpresaID,
        tipoDocumento: empleado.TipoDocumento,
        numeroDocumento: empleado.NumeroDocumento,
        fechaNacimiento: empleado.FechaNacimiento ? empleado.FechaNacimiento.split("T")[0] : "",
        edad: empleado.Edad,
        genero: empleado.Genero,
        raza: empleado.Raza,
        estadoCivil: empleado.EstadoCivil,
        municipio: empleado.Municipio,
        direccion: empleado.Direccion,
        medioTransporte: empleado.MedioTransporte,
        celular: empleado.Celular,
        correo: empleado.Correo,
        contactoEmergencia: empleado.ContactoEmergencia,
        celularEmergencia: empleado.CelularEmergencia,
      });
    } else {
      setEditMode(false);
      setFormData({
        id: "",
        nombre: "",
        apellido: "",
        cargo: "",
        empresaID: "",
        tipoDocumento: "",
        numeroDocumento: "",
        fechaNacimiento: "",
        edad: "",
        genero: "",
        raza: "",
        estadoCivil: "",
        municipio: "",
        direccion: "",
        medioTransporte: "",
        celular: "",
        correo: "",
        contactoEmergencia: "",
        celularEmergencia: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editMode) {
        const res = await axios.put(`http://localhost:5000/api/empleados/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpleados(
          empleados.map((emp) =>
            emp.ID === res.data.empleado.ID ? res.data.empleado : emp
          )
        );
      } else {
        const res = await axios.post("http://localhost:5000/api/empleados", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmpleados([...empleados, res.data.empleado]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error al guardar empleado:", err);
      setError("Error al guardar empleado.");
    }
  };

  const handleDeleteEmpleado = async (id) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar este empleado?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/empleados/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpleados(empleados.filter((emp) => emp.ID !== id));
    } catch (err) {
      console.error("Error al eliminar empleado:", err);
      setError("Error al eliminar empleado.");
    }
  };

  // Filtrado para la pestaña "Empleados por Empresa"
  const filteredEmpleadosByCompany = empleados.filter((emp) =>
    selectedCompanyFilter ? emp.EmpresaID.toString() === selectedCompanyFilter : true
  );

  // Filtrado para búsqueda (por nombre o número de documento)
  const finalFilteredEmpleados = filteredEmpleadosByCompany.filter((emp) => {
    const term = searchFilter.toLowerCase();
    return (
      emp.Nombre.toLowerCase().includes(term) ||
      emp.NumeroDocumento.toLowerCase().includes(term)
    );
  });

  // Función para exportar a Excel
  const exportToExcel = () => {
    const wsData = [
      [
        "ID",
        "Nombre",
        "Apellido",
        "Cargo",
        "Empresa",
        "Tipo Documento",
        "Número Documento",
        "Fecha Nac.",
        "Edad",
        "Género",
        "Raza",
        "Estado Civil",
        "Municipio",
        "Dirección",
        "Medio Transporte",
        "Celular",
        "Correo",
        "Contacto Emergencia",
        "Cel. Contacto",
      ],
    ];

    finalFilteredEmpleados.forEach((emp) => {
      wsData.push([
        emp.ID,
        emp.Nombre,
        emp.Apellido,
        emp.Cargo,
        getCompanyName(emp.EmpresaID),
        emp.TipoDocumento,
        emp.NumeroDocumento,
        emp.FechaNacimiento ? emp.FechaNacimiento.split("T")[0] : "",
        emp.Edad,
        emp.Genero,
        emp.Raza,
        emp.EstadoCivil,
        emp.Municipio,
        emp.Direccion,
        emp.MedioTransporte,
        emp.Celular,
        emp.Correo,
        emp.ContactoEmergencia,
        emp.CelularEmergencia,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Empleados");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "empleados.xlsx");
  };

  return (
    <Container className="empleados-container mt-4">
      <Tabs defaultActiveKey="gestion" id="empleados-tabs" className="mb-3">
        {/* Pestaña de Gestión de Empleados */}
        <Tab eventKey="gestion" title="Gestión de Empleados">
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Button variant="success" onClick={() => handleShowModal()}>
              Agregar Empleado
            </Button>
            <Button variant="primary" onClick={exportToExcel}>
              Exportar a Excel
            </Button>
          </div>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cargo</th>
                  <th>Empresa</th>
                  <th>Tipo Doc.</th>
                  <th>N° Doc.</th>
                  <th>Fecha Nac.</th>
                  <th>Edad</th>
                  <th>Género</th>
                  <th>Raza</th>
                  <th>Estado Civil</th>
                  <th>Municipio</th>
                  <th>Dirección</th>
                  <th>Transporte</th>
                  <th>Celular</th>
                  <th>Correo</th>
                  <th>Contacto Emergencia</th>
                  <th>Cel. Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  <tr key={emp.ID}>
                    <td>{emp.ID}</td>
                    <td>{emp.Nombre}</td>
                    <td>{emp.Apellido}</td>
                    <td>{emp.Cargo}</td>
                    <td>{getCompanyName(emp.EmpresaID)}</td>
                    <td>{emp.TipoDocumento}</td>
                    <td>{emp.NumeroDocumento}</td>
                    <td>{emp.FechaNacimiento ? emp.FechaNacimiento.split("T")[0] : ""}</td>
                    <td>{emp.Edad}</td>
                    <td>{emp.Genero}</td>
                    <td>{emp.Raza}</td>
                    <td>{emp.EstadoCivil}</td>
                    <td>{emp.Municipio}</td>
                    <td>{emp.Direccion}</td>
                    <td>{emp.MedioTransporte}</td>
                    <td>{emp.Celular}</td>
                    <td>{emp.Correo}</td>
                    <td>{emp.ContactoEmergencia}</td>
                    <td>{emp.CelularEmergencia}</td>
                    <td>
                      <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(emp)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteEmpleado(emp.ID)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        {/* Pestaña para filtrar empleados por empresa */}
        <Tab eventKey="filtrado" title="Empleados por Empresa">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Select
              style={{ maxWidth: "250px" }}
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
            >
              <option value="">Todas las empresas</option>
              {companies.map((comp) => (
                <option key={comp.ID} value={comp.ID}>
                  {comp.Nombre}
                </option>
              ))}
            </Form.Select>
            <InputGroup style={{ maxWidth: "300px" }}>
              <FormControl
                placeholder="Buscar por nombre o N° Doc."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </InputGroup>
          </div>
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cargo</th>
                  <th>Empresa</th>
                  <th>Tipo Doc.</th>
                  <th>N° Doc.</th>
                  <th>Fecha Nac.</th>
                  <th>Edad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados
                  .filter((emp) =>
                    selectedCompanyFilter ? emp.EmpresaID.toString() === selectedCompanyFilter : true
                  )
                  .filter((emp) => {
                    const term = searchFilter.toLowerCase();
                    return (
                      emp.Nombre.toLowerCase().includes(term) ||
                      emp.NumeroDocumento.toLowerCase().includes(term)
                    );
                  })
                  .map((emp) => (
                    <tr key={emp.ID}>
                      <td>{emp.ID}</td>
                      <td>{emp.Nombre}</td>
                      <td>{emp.Apellido}</td>
                      <td>{emp.Cargo}</td>
                      <td>{getCompanyName(emp.EmpresaID)}</td>
                      <td>{emp.TipoDocumento}</td>
                      <td>{emp.NumeroDocumento}</td>
                      <td>{emp.FechaNacimiento ? emp.FechaNacimiento.split("T")[0] : ""}</td>
                      <td>{emp.Edad}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleShowModal(emp)}>
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>

      {/* Modal para agregar/editar empleado */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar Empleado" : "Agregar Empleado"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formApellido" className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCargo" className="mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Control
                type="text"
                name="cargo"
                value={formData.cargo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmpresa" className="mb-3">
              <Form.Label>Empresa</Form.Label>
              <Form.Select
                name="empresaID"
                value={formData.empresaID}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una empresa</option>
                {companies.map((comp) => (
                  <option key={comp.ID} value={comp.ID}>
                    {comp.Nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formTipoDocumento" className="mb-3">
              <Form.Label>Tipo de Documento</Form.Label>
              <Form.Select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un tipo</option>
                {tiposDocumento.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formNumeroDocumento" className="mb-3">
              <Form.Label>Número de Documento</Form.Label>
              <Form.Control
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formFechaNacimiento" className="mb-3">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEdad" className="mb-3">
              <Form.Label>Edad</Form.Label>
              <Form.Control
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formGenero" className="mb-3">
              <Form.Label>Género</Form.Label>
              <Form.Select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {generos.map((gen, idx) => (
                  <option key={idx} value={gen}>
                    {gen}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formRaza" className="mb-3">
              <Form.Label>Raza</Form.Label>
              <Form.Select
                name="raza"
                value={formData.raza}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {razas.map((r, idx) => (
                  <option key={idx} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formEstadoCivil" className="mb-3">
              <Form.Label>Estado Civil</Form.Label>
              <Form.Select
                name="estadoCivil"
                value={formData.estadoCivil}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                {estadosCiviles.map((ec, idx) => (
                  <option key={idx} value={ec}>
                    {ec}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formMunicipio" className="mb-3">
              <Form.Label>Municipio de Residencia</Form.Label>
              <Form.Control
                type="text"
                name="municipio"
                value={formData.municipio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDireccion" className="mb-3">
              <Form.Label>Dirección de Residencia</Form.Label>
              <Form.Control
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formMedioTransporte" className="mb-3">
              <Form.Label>Medio de Transporte</Form.Label>
              <Form.Select
                name="medioTransporte"
                value={formData.medioTransporte}
                onChange={handleChange}
              >
                <option value="">Seleccione</option>
                {mediosTransporte.map((mt, idx) => (
                  <option key={idx} value={mt}>
                    {mt}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formCelular" className="mb-3">
              <Form.Label>Número de Celular</Form.Label>
              <Form.Control
                type="text"
                name="celular"
                value={formData.celular}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCorreo" className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formContactoEmergencia" className="mb-3">
              <Form.Label>Contacto en Caso de Emergencia</Form.Label>
              <Form.Control
                type="text"
                name="contactoEmergencia"
                value={formData.contactoEmergencia}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCelularEmergencia" className="mb-3">
              <Form.Label>Celular de Contacto de Emergencia</Form.Label>
              <Form.Control
                type="text"
                name="celularEmergencia"
                value={formData.celularEmergencia}
                onChange={handleChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editMode ? "Actualizar" : "Agregar"} Empleado
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Empleados;
