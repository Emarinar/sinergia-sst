import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Button,
  Table,
  Modal,
  Form,
  Alert,
  Spinner,
  Row,
  Col,
  InputGroup,
  FormControl
} from "react-bootstrap";
import {
  getTipos,
  createTipo,
  updateTipo,
  deleteTipo,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getChecklistMaster,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getPlantillas,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  getNotificacionesConfig,
  updateNotificacionesConfig,
  getParametros,
  updateParametros
} from "../../services/auditoriasService";
import "./Auditorias.css";

const AuditoriasAdministracion = () => {
  const [activeTab, setActiveTab] = useState("tipos");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tipos
  const [tipos, setTipos] = useState([]);
  const [tipoModal, setTipoModal] = useState({ show: false, isEdit: false, data: { id: null, nombre: "" } });

  // Roles
  const [roles, setRoles] = useState([]);
  const [roleModal, setRoleModal] = useState({ show: false, isEdit: false, data: { id: null, nombre: "" } });

  // Checklist Maestro
  const [checklist, setChecklist] = useState([]);
  const [checkModal, setCheckModal] = useState({ show: false, isEdit: false, data: { id: null, descripcion: "" } });

  // Plantillas
  const [plantillas, setPlantillas] = useState([]);
  const [plantillaModal, setPlantillaModal] = useState({ show: false, isEdit: false, data: { id: null, nombre: "", url: "" } });

  // Notificaciones
  const [notifConfig, setNotifConfig] = useState({ reminderEmail: false, reminderSMS: false });
  const [notifModalError, setNotifModalError] = useState("");

  // Parámetros
  const [parametros, setParametros] = useState({ periodicidadDefault: "mensual", umbralCriticidad: "media" });
  const [paramError, setParamError] = useState("");

  useEffect(() => {
    loadActiveTab();
  }, [activeTab]);

  const loadActiveTab = async () => {
    setError("");
    setLoading(true);
    try {
      switch (activeTab) {
        case "tipos": {
          const { data } = await getTipos(); setTipos(data); break;
        }
        case "roles": {
          const { data } = await getRoles(); setRoles(data); break;
        }
        case "checklist": {
          const { data } = await getChecklistMaster(); setChecklist(data); break;
        }
        case "plantillas": {
          const { data } = await getPlantillas(); setPlantillas(data); break;
        }
        case "notificaciones": {
          const { data } = await getNotificacionesConfig(); setNotifConfig(data); break;
        }
        case "config": {
          const { data } = await getParametros(); setParametros(data); break;
        }
        default: break;
      }
    } catch (err) {
      console.error(err);
      setError("Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  };

  /*-------------- TIPOS --------------*/
  const handleSaveTipo = async () => {
    if (!tipoModal.data.nombre) return;
    try {
      if (tipoModal.isEdit) await updateTipo(tipoModal.data.id, tipoModal.data);
      else await createTipo(tipoModal.data);
      setTipoModal({ ...tipoModal, show: false });
      loadActiveTab();
    } catch {
      setError("Error al guardar tipo.");
    }
  };

  /*-------------- ROLES --------------*/
  const handleSaveRole = async () => {
    if (!roleModal.data.nombre) return;
    try {
      if (roleModal.isEdit) await updateRole(roleModal.data.id, roleModal.data);
      else await createRole(roleModal.data);
      setRoleModal({ ...roleModal, show: false });
      loadActiveTab();
    } catch {
      setError("Error al guardar rol.");
    }
  };

  /*-------------- CHECKLIST --------------*/
  const handleSaveCheck = async () => {
    if (!checkModal.data.descripcion) return;
    try {
      if (checkModal.isEdit) await updateChecklistItem(checkModal.data.id, checkModal.data);
      else await createChecklistItem(checkModal.data);
      setCheckModal({ ...checkModal, show: false });
      loadActiveTab();
    } catch {
      setError("Error al guardar ítem.");
    }
  };

  /*-------------- PLANTILLAS --------------*/
  const handleSavePlantilla = async () => {
    const d = plantillaModal.data;
    if (!d.nombre || !d.url) return;
    try {
      if (plantillaModal.isEdit) await updatePlantilla(d.id, d);
      else await createPlantilla(d);
      setPlantillaModal({ ...plantillaModal, show: false });
      loadActiveTab();
    } catch {
      setError("Error al guardar plantilla.");
    }
  };

  /*-------------- NOTIFICACIONES --------------*/
  const handleSaveNotif = async () => {
    try {
      await updateNotificacionesConfig(notifConfig);
      setNotifModalError("");
    } catch {
      setNotifModalError("Error al guardar configuración.");
    }
  };

  /*-------------- PARÁMETROS --------------*/
  const handleSaveParams = async () => {
    try {
      await updateParametros(parametros);
      setParamError("");
    } catch {
      setParamError("Error al guardar parámetros.");
    }
  };

  return (
    <Container className="mt-4 auditorias-container">
      <h2>Administración de Auditorías</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="tipos" title="Tipos de Auditoría">
          {loading
            ? <Spinner />
            : <>  
                <Button className="mb-2" onClick={() => setTipoModal({ show: true, isEdit: false, data: { id: null, nombre: "" } })}>
                  + Nuevo Tipo
                </Button>
                <Table striped bordered hover>
                  <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {tipos.map(t=>(
                      <tr key={t.ID}>
                        <td>{t.ID}</td>
                        <td>{t.Nombre}</td>
                        <td>
                          <Button size="sm" variant="warning" className="me-2"
                            onClick={()=>setTipoModal({ show:true, isEdit:true, data:{ id:t.ID, nombre:t.Nombre } })}>
                            Editar
                          </Button>
                          <Button size="sm" variant="danger" onClick={()=>{ deleteTipo(t.ID).then(loadActiveTab) }}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
          }
          <Modal show={tipoModal.show} onHide={()=>setTipoModal({...tipoModal,show:false})}>
            <Modal.Header closeButton><Modal.Title>{tipoModal.isEdit?"Editar Tipo":"Nuevo Tipo"}</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" value={tipoModal.data.nombre}
                  onChange={e=>setTipoModal({...tipoModal,data:{...tipoModal.data,nombre:e.target.value}})} />
              </Form.Group>
              <div className="mt-3 text-end">
                <Button onClick={handleSaveTipo}>Guardar</Button>
              </div>
            </Modal.Body>
          </Modal>
        </Tab>

        <Tab eventKey="roles" title="Roles y Permisos">
          {loading
            ? <Spinner />
            : <>
                <Button className="mb-2" onClick={()=>setRoleModal({ show:true,isEdit:false,data:{id:null,nombre:""} })}>
                  + Nuevo Rol
                </Button>
                <Table striped bordered hover>
                  <thead><tr><th>ID</th><th>Nombre</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {roles.map(r=>(
                      <tr key={r.ID}>
                        <td>{r.ID}</td><td>{r.Nombre}</td>
                        <td>
                          <Button size="sm" variant="warning" className="me-2"
                            onClick={()=>setRoleModal({ show:true,isEdit:true,data:{id:r.ID,nombre:r.Nombre} })}>
                            Editar
                          </Button>
                          <Button size="sm" variant="danger" onClick={()=>{ deleteRole(r.ID).then(loadActiveTab) }}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </>
          }
          <Modal show={roleModal.show} onHide={()=>setRoleModal({...roleModal,show:false})}>
            <Modal.Header closeButton><Modal.Title>{roleModal.isEdit?"Editar Rol":"Nuevo Rol"}</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" value={roleModal.data.nombre}
                  onChange={e=>setRoleModal({...roleModal,data:{...roleModal.data,nombre:e.target.value}})} />
              </Form.Group>
              <div className="mt-3 text-end"><Button onClick={handleSaveRole}>Guardar</Button></div>
            </Modal.Body>
          </Modal>
        </Tab>

        <Tab eventKey="checklist" title="Checklist Maestro">
          {loading
            ? <Spinner />
            : <>
                <Button className="mb-2" onClick={()=>setCheckModal({ show:true,isEdit:false,data:{id:null,descripcion:""} })}>
                  + Nuevo Ítem
                </Button>
                <Table striped bordered hover>
                  <thead><tr><th>ID</th><th>Descripción</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {checklist.map(c=>(
                      <tr key={c.ID}><td>{c.ID}</td><td>{c.Descripcion}</td><td>
                        <Button size="sm" variant="warning" className="me-2"
                          onClick={()=>setCheckModal({ show:true,isEdit:true,data:{id:c.ID,descripcion:c.Descripcion} })}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={()=>{ deleteChecklistItem(c.ID).then(loadActiveTab) }}>
                          Eliminar
                        </Button>
                      </td></tr>
                    ))}
                  </tbody>
                </Table>
              </>
          }
          <Modal show={checkModal.show} onHide={()=>setCheckModal({...checkModal,show:false})}>
            <Modal.Header closeButton><Modal.Title>{checkModal.isEdit?"Editar Ítem":"Nuevo Ítem"}</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={2} value={checkModal.data.descripcion}
                  onChange={e=>setCheckModal({...checkModal,data:{...checkModal.data,descripcion:e.target.value}})} />
              </Form.Group>
              <div className="mt-3 text-end"><Button onClick={handleSaveCheck}>Guardar</Button></div>
            </Modal.Body>
          </Modal>
        </Tab>

        <Tab eventKey="plantillas" title="Plantillas de Informe">
          {loading
            ? <Spinner />
            : <>
                <Button className="mb-2" onClick={()=>setPlantillaModal({ show:true,isEdit:false,data:{id:null,nombre:"",url:""} })}>
                  + Nueva Plantilla
                </Button>
                <Table striped bordered hover>
                  <thead><tr><th>ID</th><th>Nombre</th><th>URL</th><th>Acciones</th></tr></thead>
                  <tbody>
                    {plantillas.map(p=>(
                      <tr key={p.ID}><td>{p.ID}</td><td>{p.Nombre}</td><td>{p.URL}</td><td>
                        <Button size="sm" variant="warning" className="me-2"
                          onClick={()=>setPlantillaModal({ show:true,isEdit:true,data:{id:p.ID,nombre:p.Nombre,url:p.URL} })}>
                          Editar
                        </Button>
                        <Button size="sm" variant="danger" onClick={()=>{ deletePlantilla(p.ID).then(loadActiveTab) }}>
                          Eliminar
                        </Button>
                      </td></tr>
                    ))}
                  </tbody>
                </Table>
              </>
          }
          <Modal show={plantillaModal.show} onHide={()=>setPlantillaModal({...plantillaModal,show:false})}>
            <Modal.Header closeButton><Modal.Title>{plantillaModal.isEdit?"Editar":"Nueva"} Plantilla</Modal.Title></Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-2">
                <Form.Label>Nombre</Form.Label>
                <Form.Control type="text" value={plantillaModal.data.nombre}
                  onChange={e=>setPlantillaModal({...plantillaModal,data:{...plantillaModal.data,nombre:e.target.value}})} />
              </Form.Group>
              <Form.Group>
                <Form.Label>URL</Form.Label>
                <Form.Control type="text" value={plantillaModal.data.url}
                  onChange={e=>setPlantillaModal({...plantillaModal,data:{...plantillaModal.data,url:e.target.value}})} />
              </Form.Group>
              <div className="mt-3 text-end"><Button onClick={handleSavePlantilla}>Guardar</Button></div>
            </Modal.Body>
          </Modal>
        </Tab>

        <Tab eventKey="notificaciones" title="Notificaciones">
          {loading
            ? <Spinner />
            : <Form>
                <Form.Check
                  type="checkbox"
                  label="Recordatorios por Email"
                  checked={notifConfig.reminderEmail}
                  onChange={e=>setNotifConfig({...notifConfig, reminderEmail: e.target.checked})}
                />
                <Form.Check
                  type="checkbox"
                  label="Recordatorios por SMS"
                  checked={notifConfig.reminderSMS}
                  onChange={e=>setNotifConfig({...notifConfig, reminderSMS: e.target.checked})}
                />
                {notifModalError && <Alert variant="danger">{notifModalError}</Alert>}
                <div className="mt-3 text-end"><Button onClick={handleSaveNotif}>Guardar</Button></div>
              </Form>
          }
        </Tab>

        <Tab eventKey="config" title="Parámetros Generales">
          {loading
            ? <Spinner />
            : <Form>
                <Form.Group className="mb-2">
                  <Form.Label>Periodicidad por defecto</Form.Label>
                  <FormControl as="select" value={parametros.periodicidadDefault}
                    onChange={e=>setParametros({...parametros, periodicidadDefault: e.target.value})}>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </FormControl>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Umbral de criticidad por defecto</Form.Label>
                  <FormControl as="select" value={parametros.umbralCriticidad}
                    onChange={e=>setParametros({...parametros, umbralCriticidad: e.target.value})}>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </FormControl>
                </Form.Group>
                {paramError && <Alert variant="danger">{paramError}</Alert>}
                <div className="mt-3 text-end"><Button onClick={handleSaveParams}>Guardar</Button></div>
              </Form>
          }
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AuditoriasAdministracion;
