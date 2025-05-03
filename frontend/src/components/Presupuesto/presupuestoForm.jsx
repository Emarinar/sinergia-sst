import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { createGasto } from "../../services/presupuestoService";
import "./Presupuesto.css";

const PresupuestoForm = ({ onGastoRegistrado }) => {
  const [formData, setFormData] = useState({
    fecha: "",
    categoria: "",
    descripcion: "",
    monto: "",
    factura: "",
    proveedor: "",
    empresaID: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  const categorias = ["EPP", "Capacitaciones", "Profesionales SST", "Otros"];

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/empresas", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data);
      } catch (err) {
        console.error("Error al obtener empresas:", err);
        setError("Error al obtener empresas.");
      }
    })();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const newGasto = await createGasto(formData, token);
      onGastoRegistrado?.(newGasto);
      setFormData({
        fecha: "",
        categoria: "",
        descripcion: "",
        monto: "",
        factura: "",
        proveedor: "",
        empresaID: ""
      });
    } catch (err) {
      console.error("Error al registrar gasto:", err);
      setError("Error al registrar gasto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="presupuesto-form">
      <h3>Registrar Gasto</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFecha" className="mb-3">
          <Form.Label>Fecha de Gasto</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={formData.fecha}
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
        <Form.Group controlId="formCategoria" className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="formDescripcion" className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            placeholder="Descripción del gasto"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formMonto" className="mb-3">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            placeholder="Monto del gasto"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formFactura" className="mb-3">
          <Form.Label>Número de Factura (opcional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Número de factura"
            name="factura"
            value={formData.factura}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formProveedor" className="mb-3">
          <Form.Label>Proveedor (opcional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Proveedor"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar Gasto"}
        </Button>
      </Form>
    </div>
  );
};

export default PresupuestoForm;
