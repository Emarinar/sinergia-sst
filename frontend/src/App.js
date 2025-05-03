import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

import NavigationBar from "./components/UI/NavigationBar";
import Sidebar from "./components/UI/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Usuarios from "./components/Usuarios/Usuarios";
import Empresas from "./components/Empresas/Empresas";
import Empleados from "./components/Empleados/Empleados";
import Documentos from "./components/Documentos/Documentos";
import Formularios from "./components/Formularios/Formularios";
import FormResponder from "./components/Formularios/FormResponder";
import PublicResponder from "./components/Formularios/PublicResponder";
import Plantillas from "./components/Plantillas/Plantillas";
import Presupuesto from "./components/Presupuesto/Presupuesto";
import Auditorias from "./components/Auditorias/Auditorias";
import Capacitaciones from "./components/Capacitaciones/Capacitaciones";
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import "./App.css";

const App = () => (
  <BrowserRouter>
    <div className="app-container d-flex flex-column min-vh-100">
      <NavigationBar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <Container fluid className="main-content p-4">
          <Routes>
            {/* Pública */}
            <Route path="/login" element={<Login />} />
            <Route path="/public/formularios/:id" element={<PublicResponder />} />

            {/* Protegidas */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <Usuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/empresas"
              element={
                <ProtectedRoute>
                  <Empresas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/empleados"
              element={
                <ProtectedRoute>
                  <Empleados />
                </ProtectedRoute>
              }
            />
            <Route
              path="/documentos"
              element={
                <ProtectedRoute>
                  <Documentos />
                </ProtectedRoute>
              }
            />

            {/* Formularios */}
            <Route
              path="/formularios"
              element={
                <ProtectedRoute>
                  <Formularios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/formularios/:id/editar"
              element={
                <ProtectedRoute>
                  <Formularios />
                </ProtectedRoute>
              }
            />
            <Route
              path="/formularios/:id/responder"
              element={
                <ProtectedRoute>
                  <FormResponder />
                </ProtectedRoute>
              }
            />

            {/* Otros módulos */}
            <Route
              path="/plantillas"
              element={
                <ProtectedRoute>
                  <Plantillas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/presupuesto"
              element={
                <ProtectedRoute>
                  <Presupuesto />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auditorias"
              element={
                <ProtectedRoute>
                  <Auditorias />
                </ProtectedRoute>
              }
            />
            <Route
              path="/capacitaciones"
              element={
                <ProtectedRoute>
                  <Capacitaciones />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </div>
    </div>
  </BrowserRouter>
);

export default App;
