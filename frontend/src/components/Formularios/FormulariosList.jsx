import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchForms, deleteForm } from '../../services/formService';
import './Formularios.css';

const FormulariosList = ({ onShare, onSelectForm, onEditForm }) => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    fetchForms()
      .then(data => {
        setForms(data);
        setError('');
      })
      .catch(() => setError('No se pudieron cargar los formularios.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = id => {
    if (window.confirm('¿Eliminar este formulario?')) {
      deleteForm(id).then(load);
    }
  };

  return (
    <div className="formularios-list">
      <h3>Formularios Disponibles</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(f => (
              <tr key={f.ID}>
                <td>{f.ID}</td>
                <td>{f.Titulo}</td>
                <td className="d-flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => {
                      navigate(`/formularios/${f.ID}/responder`);
                      onSelectForm(f.ID);
                    }}
                  >
                    Responder
                  </Button>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onEditForm(f)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(f.ID)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => onShare(f.ID)}
                  >
                    Compartir
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onSelectForm(f.ID)}
                  >
                    Seleccionar
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
