import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaUserTie,
  FaFileAlt,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaClipboardCheck,
  FaCalendarAlt
} from "react-icons/fa";
import "./UIStyles.css";

// Definimos los módulos con nombre, ruta e ícono
const modules = [
  { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
  { name: "Usuarios", path: "/usuarios", icon: <FaUsers /> },
  { name: "Empresas", path: "/empresas", icon: <FaBuilding /> },
  { name: "Empleados", path: "/empleados", icon: <FaUserTie /> },
  { name: "Documentos", path: "/documentos", icon: <FaFileAlt /> },
  { name: "Formularios", path: "/formularios", icon: <FaClipboardList /> },
  { name: "Plantillas", path: "/plantillas", icon: <FaFileAlt /> },
  { name: "Presupuesto", path: "/presupuesto", icon: <FaFileInvoiceDollar /> },
  { name: "Auditorías", path: "/auditorias", icon: <FaClipboardCheck /> },
  { name: "Capacitaciones", path: "/capacitaciones", icon: <FaCalendarAlt /> },
];

const Sidebar = () => {
  return (
    <div className="sidebar">
      {modules.map((mod, index) => (
        <NavLink
          key={index}
          to={mod.path}
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <div className="sidebar-icon">{mod.icon}</div>
          <div className="sidebar-label">{mod.name}</div>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
