import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import './Formularios.css';

const SyncMicrosoftAccount = () => {
  const [synced, setSynced] = useState(false);
  const [error, setError] = useState('');

  const handleSync = async () => {
    try {
      // Aquí implementarías la lógica de OAuth para Microsoft
      // Por ejemplo, abrir una ventana de autenticación y obtener el token
      setTimeout(() => {
        setSynced(true);
      }, 1000);
    } catch (err) {
      console.error("Error al sincronizar cuenta:", err);
      setError("Error al sincronizar cuenta de Microsoft.");
    }
  };

  return (
    <div className="sync-ms-container">
      <h5>Sincronizar Cuenta de Microsoft Forms</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      {synced ? (
        <Alert variant="success">Cuenta sincronizada</Alert>
      ) : (
        <Button variant="outline-primary" onClick={handleSync}>
          Sincronizar Cuenta
        </Button>
      )}
    </div>
  );
};

export default SyncMicrosoftAccount;
