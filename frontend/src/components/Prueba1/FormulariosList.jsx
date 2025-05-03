import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import './Formularios.css';

const FormulariosList = ({ formularios }) => {
  return (
    <div className="formularios-list-container">
      <h4>Listado de Formularios Integrados</h4>
      {formularios.length === 0 ? (
        <p>No hay formularios registrados.</p>
      ) : (
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Fecha de Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {formularios.map((form) => (
              <tr key={form.ID}>
                <td>{form.ID}</td>
                <td>{form.nombre}</td>
                <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button variant="info" size="sm">
                    <FaEye /> Ver Detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default FormulariosList;
