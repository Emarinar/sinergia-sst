// src/components/Empresas/Empresas.jsx
import React, { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Spinner, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { motion } from "framer-motion";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./Empresas.css";

const Empresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados para edición de empresa
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  // Estados para agregar empresa
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmpresa, setNewEmpresa] = useState({
    nombre: "",
    nit: "",
    contacto: "",
  });
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    fetchEmpresas();
  }, []);

  const fetchEmpresas = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:5000/api/empresas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpresas(res.data);
    } catch (err) {
      console.error("Error al obtener empresas:", err);
      setError("Error al cargar empresas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar esta empresa?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/empresas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpresas(empresas.filter((empresa) => empresa.ID !== id));
    } catch (err) {
      console.error("Error al eliminar empresa:", err);
      setError("Error al eliminar empresa.");
    }
  };

  const handleEditClick = (empresa) => {
    setSelectedEmpresa(empresa);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedEmpresa({ ...selectedEmpresa, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(`http://localhost:5000/api/empresas/${selectedEmpresa.ID}`, {
        nombre: selectedEmpresa.Nombre,
        nit: selectedEmpresa.NIT || selectedEmpresa.Nit, // Usamos NIT en mayúsculas si existe
        contacto: selectedEmpresa.Contacto,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpresas(
        empresas.map((empresa) =>
          empresa.ID === selectedEmpresa.ID ? res.data.empresa : empresa
        )
      );
      setShowEditModal(false);
    } catch (err) {
      console.error("Error al actualizar empresa:", err);
      setError("Error al actualizar empresa.");
    }
  };

  const handleAddChange = (e) => {
    setNewEmpresa({ ...newEmpresa, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post("http://localhost:5000/api/empresas", {
        nombre: newEmpresa.nombre,
        nit: newEmpresa.nit,
        contacto: newEmpresa.contacto,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmpresas([...empresas, res.data.empresa]);
      setAddSuccess("Empresa registrada correctamente.");
      setNewEmpresa({ nombre: "", nit: "", contacto: "" });
      setTimeout(() => {
        setShowAddModal(false);
        setAddSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Error al registrar empresa:", err);
      setAddError(err.response?.data?.mensaje || "Error al registrar empresa.");
    }
  };

  return (
    <Container className="empresas-container mt-4">
      <h2 className="text-center my-4 text-white">Gestión de Empresas</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          Agregar Empresa
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
                <th>NIT</th>
                <th>Contacto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.ID}>
                  <td>{empresa.ID}</td>
                  <td>{empresa.Nombre}</td>
                  <td>{empresa.NIT || empresa.Nit}</td>
                  <td>{empresa.Contacto}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(empresa)}>
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(empresa.ID)}>
                      <FaTrashAlt />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      )}

      {/* Modal para editar empresa */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmpresa && (
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="editNombre" className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="Nombre"
                  value={selectedEmpresa.Nombre}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="editNit" className="mb-3">
                <Form.Label>NIT</Form.Label>
                <Form.Control
                  type="text"
                  name="Nit"
                  value={selectedEmpresa.NIT || selectedEmpresa.Nit}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="editContacto" className="mb-3">
                <Form.Label>Contacto</Form.Label>
                <Form.Control
                  type="text"
                  name="Contacto"
                  value={selectedEmpresa.Contacto}
                  onChange={handleEditChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para agregar nueva empresa */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddSubmit}>
            {addError && <Alert variant="danger">{addError}</Alert>}
            {addSuccess && <Alert variant="success">{addSuccess}</Alert>}
            <Form.Group controlId="addNombre" className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={newEmpresa.nombre}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="addNit" className="mb-3">
              <Form.Label>NIT</Form.Label>
              <Form.Control
                type="text"
                name="nit"
                value={newEmpresa.nit}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="addContacto" className="mb-3">
              <Form.Label>Contacto</Form.Label>
              <Form.Control
                type="text"
                name="contacto"
                value={newEmpresa.contacto}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Registrar Empresa
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Empresas;
