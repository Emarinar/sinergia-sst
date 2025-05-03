// src/components/Formularios/CrearFormulario.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { createForm, updateForm } from '../../services/formService';
import './Formularios.css';

const CrearFormulario = ({ existing, onSuccess }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [campos, setCampos] = useState([]);
  const [error, setError] = useState('');

  // Cuando cambia `existing`, inicializamos los campos
  useEffect(() => {
    if (existing) {
      setTitulo(existing.Titulo || '');
      setDescripcion(existing.Descripcion || '');
      const initial = (existing.campos || []).map(c => ({
        etiqueta: c.Etiqueta || '',
        tipo: c.Tipo || 'texto',
        opciones: c.Opciones ? JSON.parse(c.Opciones) : [],
        requerido: !!c.Requerido
      }));
      setCampos(initial);
    }
  }, [existing]);

  const handleAddCampo = () => {
    setCampos(prev => [
      ...prev,
      { etiqueta: '', tipo: 'texto', opciones: [], requerido: false }
    ]);
  };

  const handleCampoChange = (index, key, value) => {
    setCampos(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('El título es requerido.');
      return;
    }
    setError('');
    const payload = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      campos: campos.map(c => ({
        etiqueta: c.etiqueta.trim(),
        tipo: c.tipo,
        opciones: c.opciones,
        requerido: !!c.requerido
      }))
    };
    try {
      let res;
      if (existing && existing.ID) {
        res = await updateForm(existing.ID, payload);
        onSuccess(existing.ID);
      } else {
        res = await createForm(payload);
        onSuccess(res.id);
      }
    } catch (err) {
      console.error('Error al guardar formulario:', err);
      setError('Hubo un error al guardar. Intenta de nuevo.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          placeholder="Ingresa el título del formulario"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Opcional"
        />
      </Form.Group>

      <hr />
      <h5>Campos</h5>

      {campos.map((c, i) => (
        <div key={i} className="mb-3 p-2 border rounded">
          <Form.Control
            className="mb-1"
            placeholder="Etiqueta"
            value={c.etiqueta}
            onChange={e => handleCampoChange(i, 'etiqueta', e.target.value)}
          />

          <Form.Select
            className="mb-1"
            value={c.tipo}
            onChange={e => handleCampoChange(i, 'tipo', e.target.value)}
          >
            <option value="texto">Texto</option>
            <option value="numero">Número</option>
            <option value="fecha">Fecha</option>
            <option value="seleccion">Selección</option>
            <option value="checkbox">Checkbox</option>
          </Form.Select>

          <Form.Control
            className="mb-1"
            placeholder="Opciones (separadas por comas)"
            value={(c.opciones || []).join(',')}
            onChange={e =>
              handleCampoChange(
                i,
                'opciones',
                e.target.value
                  .split(',')
                  .map(o => o.trim())
                  .filter(o => o)
              )
            }
          />

          <Form.Check
            type="checkbox"
            label="Requerido"
            checked={c.requerido}
            onChange={e => handleCampoChange(i, 'requerido', e.target.checked)}
          />
        </div>
      ))}

      <Button variant="secondary" className="me-2" onClick={handleAddCampo}>
        + Agregar campo
      </Button>
      <Button type="submit">Guardar formulario</Button>
    </Form>
  );
};

export default CrearFormulario;
