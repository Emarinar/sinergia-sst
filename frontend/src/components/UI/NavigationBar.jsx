// src/components/UI/NavigationBar.jsx
import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import logo from "../../assets/logo-sinergia.png";
import "./UIStyles.css";

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro que deseas cerrar sesión?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container fluid>
        {/* Logo a la izquierda con mayor tamaño */}
        <Navbar.Brand className="navbar-logo">
          <img src={logo} alt="Logo Sinergia" style={{ width: "150px", height: "auto" }} />
        </Navbar.Brand>

        {/* Título centrado */}
        <Navbar.Brand className="navbar-title">
          Sinergia Consultoría SGI
        </Navbar.Brand>

        {/* Botón de cerrar sesión a la derecha */}
        <Button variant="link" className="logout-button" onClick={handleLogout}>
          <FiLogOut size={24} />
        </Button>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
