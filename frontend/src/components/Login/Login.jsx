// src/components/Login.js
import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Tabs, Tab, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo-sinergia.png"; // Ajusta la ruta según corresponda

const Login = () => {
  const navigate = useNavigate();

  // Estados para login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Estados para registro
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState("usuario"); // Valor por defecto
  const [regCompanyId, setRegCompanyId] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  // Estado para la lista de empresas (para el registro)
  const [companyList, setCompanyList] = useState([]);

  // Estado para el modal de recuperación de contraseña
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  // Cargar la lista de empresas al montar el componente
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/empresas");
        setCompanyList(res.data);
      } catch (error) {
        console.error("Error al cargar empresas:", error);
      }
    };
    fetchCompanies();
  }, []);

  // Manejo de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await axios.post("http://localhost:5000/api/usuarios/login", {
        correo: loginEmail,
        clave: loginPassword,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
      setLoginError(error.response?.data?.error || "Error en el login");
    }
  };

  // Manejo de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    try {
      const res = await axios.post("http://localhost:5000/api/usuarios/register", {
        nombre: regName,
        correo: regEmail,
        clave: regPassword,
        rol: regRole,
        empresaID: regCompanyId,
      });
      setRegSuccess("Usuario registrado correctamente.");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
      setRegRole("usuario");
      setRegCompanyId("");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setRegError(error.response?.data?.error || "Error al registrar usuario");
    }
  };

  // Manejo de recuperación de contraseña
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotMessage("");
    try {
      // Envia el correo para recuperación (debes implementar el endpoint en el backend)
      const res = await axios.post("http://localhost:5000/api/usuarios/recuperar", {
        correo: forgotEmail,
      });
      setForgotMessage("Se ha enviado un correo para recuperar la contraseña.");
    } catch (error) {
      console.error("Error en recuperación:", error);
      setForgotError(error.response?.data?.error || "Error al recuperar contraseña");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <div className="text-center mb-4">
        <img src={logo} alt="Logo Sinergia" style={{ width: "150px" }} />
      </div>
      <Tabs defaultActiveKey="login" id="login-tabs" className="mb-3" fill>
        <Tab eventKey="login" title="Iniciar Sesión">
          <Form onSubmit={handleLogin} className="mt-3">
            {loginError && <Alert variant="danger">{loginError}</Alert>}
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu clave"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid mb-2">
              <Button variant="primary" type="submit">
                Iniciar Sesión
              </Button>
            </div>
            <div className="text-center">
              <Button variant="link" onClick={() => setShowForgotModal(true)}>
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab eventKey="register" title="Registrar Usuario">
          <Form onSubmit={handleRegister} className="mt-3">
            {regError && <Alert variant="danger">{regError}</Alert>}
            {regSuccess && <Alert variant="success">{regSuccess}</Alert>}
            <Form.Group className="mb-3" controlId="regName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresa tu nombre"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="regEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="regPassword">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu clave"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="regRole">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
              >
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="regCompany">
              <Form.Label>Empresa</Form.Label>
              <Form.Select
                value={regCompanyId}
                onChange={(e) => setRegCompanyId(e.target.value)}
                required
              >
                <option value="">Seleccione una empresa</option>
                {companyList.map((comp) => (
                  <option key={comp.ID} value={comp.ID}>
                    {comp.Nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-grid">
              <Button variant="success" type="submit">
                Registrar Usuario
              </Button>
            </div>
          </Form>
        </Tab>
      </Tabs>

      {/* Modal para recuperación de contraseña */}
      <Modal show={showForgotModal} onHide={() => setShowForgotModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Recuperar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {forgotError && <Alert variant="danger">{forgotError}</Alert>}
          {forgotMessage && <Alert variant="success">{forgotMessage}</Alert>}
          <Form onSubmit={handleForgotPassword}>
            <Form.Group className="mb-3" controlId="forgotEmail">
              <Form.Label>Ingresa tu correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo para recuperación"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit">
                Enviar Instrucciones
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Login;
