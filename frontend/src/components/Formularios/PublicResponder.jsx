import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchForm, submitResponse, exportResponses } from '../../services/formService';
import { Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import './Formularios.css';

const PublicResponder = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchForm(id)
      .then(data => {
        setForm(data);
        const init = {};
        data.campos.forEach(c => (init[c.ID] = c.Tipo === 'checkbox' ? [] : ''));
        setAnswers(init);
      })
      .catch(() => setError('No se pudo cargar.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (cid, val, tipo) => {
    if (tipo === 'checkbox') {
      setAnswers(prev => {
        const arr = prev[cid] || [];
        return { ...prev, [cid]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
      });
    } else {
      setAnswers(prev => ({ ...prev, [cid]: val }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      campos: Object.entries(answers).map(([cid, valor]) => ({
        campoId: parseInt(cid, 10),
        valor: Array.isArray(valor) ? valor.join(',') : valor
      }))
    };
    submitResponse(id, payload)
      .then(() => alert('Gracias por responder.'))
      .catch(() => setError('Error al enviar'))
      .finally(() => setSubmitting(false));
  };

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!form) return null;

  return (
    <Card className="mt-4">
      <Card.Header>
        <Row>
          <Col><h4>{form.Titulo}</h4></Col>
          <Col className="text-end">
            <Button size="sm" onClick={() => exportResponses(id)}>Exportar respuestas</Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {form.Descripcion && <p>{form.Descripcion}</p>}
          {form.campos.map(c => (
            <Form.Group key={c.ID} className="mb-3">
              <Form.Label>{c.Etiqueta}</Form.Label>
              {c.Tipo === 'texto' && (
                <Form.Control
                  value={answers[c.ID]}
                  onChange={e => handleChange(c.ID, e.target.value, c.Tipo)}
                />
              )}
              {(c.Tipo === 'numero' || c.Tipo === 'fecha') && (
                <Form.Control
                  type={c.Tipo}
                  value={answers[c.ID]}
                  onChange={e => handleChange(c.ID, e.target.value, c.Tipo)}
                />
              )}
              {c.Tipo === 'seleccion' && (
                <Form.Select
                  value={answers[c.ID]}
                  onChange={e => handleChange(c.ID, e.target.value, c.Tipo)}
                >
                  <option value="">— Selecciona —</option>
                  {JSON.parse(c.Opciones).map(opt => (
                    <option key={opt}>{opt}</option>
                  ))}
                </Form.Select>
              )}
              {c.Tipo === 'checkbox' &&
                JSON.parse(c.Opciones).map(opt => (
                  <Form.Check
                    key={opt}
                    type="checkbox"
                    label={opt}
                    checked={answers[c.ID].includes(opt)}
                    onChange={() => handleChange(c.ID, opt, c.Tipo)}
                  />
                ))}
            </Form.Group>
          ))}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Enviando…' : 'Enviar respuestas'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PublicResponder;
