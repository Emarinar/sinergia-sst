// src/components/Usuarios/Usuarios.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Button,
  Alert,
  Spinner,
  Modal,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./Usuarios.css";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para edición de usuario
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Estados para agregar usuario
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nombre: "",
    correo: "",
    clave: "",
    rol: "usuario",
    empresaID: "",
  });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    fetchUsuarios();
    fetchCompanies();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
      setError("Error al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/empresas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanies(res.data);
    } catch (err) {
      console.error("Error al obtener empresas:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar este usuario?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/usuarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(usuarios.filter((u) => u.ID !== id));
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError("Error al eliminar usuario.");
    }
  };

  const handleEditClick = (usuario) => {
    setSelectedUser(usuario);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`http://localhost:5000/api/usuarios/${selectedUser.ID}`, {
        nombre: selectedUser.Nombre,
        correo: selectedUser.Correo,
        rol: selectedUser.Rol,
        empresaID: selectedUser.EmpresaID,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(
        usuarios.map((u) =>
          u.ID === selectedUser.ID ? res.data.usuario : u
        )
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setError("Error al actualizar usuario.");
    }
  };

  // Funciones para agregar usuario
  const handleAddChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:5000/api/usuarios/register", {
        nombre: newUser.nombre,
        correo: newUser.correo,
        clave: newUser.clave,
        rol: newUser.rol,
        empresaID: newUser.empresaID,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios([...usuarios, res.data.usuario]);
      setAddSuccess("Usuario registrado correctamente.");
      setNewUser({
        nombre: "",
        correo: "",
        clave: "",
        rol: "usuario",
        empresaID: "",
      });
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error al registrar usuario:", err);
      setAddError(err.response?.data?.mensaje || "Error al registrar usuario.");
    }
  };

  // Función para obtener el nombre de la empresa a partir del ID
  const getCompanyName = (companyID) => {
    const company = companies.find((comp) => comp.ID === companyID);
    return company ? company.Nombre : companyID;
  };

  return (
    <Container className="usuarios-container mt-4">
      <h2 className="text-center my-4 text-white">Gestión de Usuarios</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          Agregar Usuario
        </Button>
      </div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="light" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <Table striped bordered hover responsive variant="dark">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Empresa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.ID}>
                  <td>{usuario.ID}</td>
                  <td>{usuario.Nombre}</td>
                  <td>{usuario.Correo}</td>
                  <td>{usuario.Rol}</td>
                  <td>{getCompanyName(usuario.EmpresaID)}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(usuario)}>
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(usuario.ID)}>
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      )}

      {/* Modal para editar usuario */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="editName" className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="Nombre"
                  value={selectedUser.Nombre}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="editEmail" className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="Correo"
                  value={selectedUser.Correo}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="editRol" className="mb-3">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  name="Rol"
                  value={selectedUser.Rol}
                  onChange={handleEditChange}
                  required
                >
                  <option value="usuario">Usuario</option>
                  <option value="admin">Administrador</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="editEmpresa" className="mb-3">
                <Form.Label>Empresa</Form.Label>
                <Form.Select
                  name="EmpresaID"
                  value={selectedUser.EmpresaID}
                  onChange={handleEditChange}
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
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para agregar nuevo usuario */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            {addError && <Alert variant="danger">{addError}</Alert>}
            {addSuccess && <Alert variant="success">{addSuccess}</Alert>}
            <Form.Group controlId="addName" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newUser.nombre}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="addEmail" className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={newUser.correo}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="addPassword" className="mb-3">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                name="clave"
                value={newUser.clave}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="addRol" className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="rol"
                value={newUser.rol}
                onChange={handleAddChange}
                required
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="addEmpresa" className="mb-3">
              <Form.Label>Empresa</Form.Label>
              <Form.Select
                name="empresaID"
                value={newUser.empresaID}
                onChange={handleAddChange}
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
            <Button variant="success" type="submit">
              Registrar Usuario
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Usuarios;
