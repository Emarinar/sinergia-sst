import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { fetchForm, createForm, updateForm } from '../../services/formService';
import './Formularios.css';

const tipos = ['texto', 'numero', 'fecha', 'select', 'checkbox', 'archivo'];

const FormBuilder = ({ formId, onSave }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [campos, setCampos] = useState([]);

  useEffect(() => {
    if (formId) {
      fetchForm(formId).then(f => {
        setTitulo(f.titulo);
        setDescripcion(f.descripcion);
        setCampos(f.campos);
      });
    } else {
      setTitulo('');
      setDescripcion('');
      setCampos([]);
    }
  }, [formId]);

  const addCampo = () =>
    setCampos([...campos, { etiqueta: '', tipo: 'texto', opciones: [], requerido: false }]);

  const save = async () => {
    const payload = { titulo, descripcion, campos };
    formId
      ? await updateForm(formId, payload)
      : await createForm(payload);
    onSave();
  };

  return (
    <div className="formularios-builder">
      <Form.Group className="mb-3">
        <Form.Label>Título</Form.Label>
        <Form.Control value={titulo} onChange={e => setTitulo(e.target.value)} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Descripción</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </Form.Group>

      {campos.map((c, i) => (
        <Card key={i} className="mb-2 p-2">
          <Form.Group className="mb-2">
            <Form.Label>Etiqueta</Form.Label>
            <Form.Control
              value={c.etiqueta}
              onChange={e => {
                c.etiqueta = e.target.value;
                setCampos([...campos]);
              }}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Tipo</Form.Label>
            <Form.Select
              value={c.tipo}
              onChange={e => {
                c.tipo = e.target.value;
                setCampos([...campos]);
              }}
            >
              {tipos.map(t => (
                <option key={t}>{t}</option>
              ))}
            </Form.Select>
          </Form.Group>

          {(c.tipo === 'select' || c.tipo === 'checkbox') && (
            <Form.Group className="mb-2">
              <Form.Label>Opciones (separadas por coma)</Form.Label>
              <Form.Control
                value={c.opciones.join(',')}
                onChange={e => {
                  c.opciones = e.target.value.split(',').map(x => x.trim());
                  setCampos([...campos]);
                }}
              />
            </Form.Group>
          )}

          <Form.Check
            type="checkbox"
            label="Requerido"
            checked={c.requerido}
            onChange={e => {
              c.requerido = e.target.checked;
              setCampos([...campos]);
            }}
          />

          <Button
            variant="danger"
            size="sm"
            onClick={() => setCampos(campos.filter((_, j) => j !== i))}
          >
            Eliminar Campo
          </Button>
        </Card>
      ))}

      <Button className="me-2" onClick={addCampo}>Agregar Campo</Button>
      <Button onClick={save}>Guardar Formulario</Button>
    </div>
  );
};

export default FormBuilder;
