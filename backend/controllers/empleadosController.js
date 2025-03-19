// backend/controllers/empleadosController.js
const { poolPromise } = require("../db");

async function listarEmpleados(req, res) {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Empleados");
    res.json(result.recordset);
  } catch (error) {
    console.error("Error al listar empleados:", error);
    res.status(500).json({ error: "Error al listar empleados." });
  }
}

async function agregarEmpleado(req, res) {
  const {
    nombre,
    apellido,
    cargo,
    empresaID,
    tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
    edad,
    genero,
    raza,
    estadoCivil,
    municipio,
    direccion,
    medioTransporte,
    celular,
    correo,
    contactoEmergencia,
    celularEmergencia
  } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    // Usamos nombres de parámetros en minúsculas para mantener la coherencia.
    request.input("nombre", nombre);
    request.input("apellido", apellido);
    request.input("cargo", cargo);
    request.input("empresaID", empresaID);
    request.input("tipoDocumento", tipoDocumento);
    request.input("numeroDocumento", numeroDocumento);
    request.input("fechaNacimiento", fechaNacimiento);
    request.input("edad", edad);
    request.input("genero", genero);
    request.input("raza", raza);
    request.input("estadoCivil", estadoCivil);
    request.input("municipio", municipio);
    request.input("direccion", direccion);
    request.input("medioTransporte", medioTransporte);
    request.input("celular", celular);
    request.input("correo", correo);
    request.input("contactoEmergencia", contactoEmergencia);
    request.input("celularEmergencia", celularEmergencia);

    const query = `
      INSERT INTO Empleados (
        Nombre, Apellido, Cargo, EmpresaID, TipoDocumento, NumeroDocumento,
        FechaNacimiento, Edad, Genero, Raza, EstadoCivil, Municipio, Direccion,
        MedioTransporte, Celular, Correo, ContactoEmergencia, CelularEmergencia, CreatedAt
      )
      OUTPUT INSERTED.*
      VALUES (
        @nombre, @apellido, @cargo, @empresaID, @tipoDocumento, @numeroDocumento,
        @fechaNacimiento, @edad, @genero, @raza, @estadoCivil, @municipio, @direccion,
        @medioTransporte, @celular, @correo, @contactoEmergencia, @celularEmergencia, GETDATE()
      )
    `;
    const result = await request.query(query);
    res.json({ empleado: result.recordset[0] });
  } catch (error) {
    console.error("Error al agregar empleado:", error);
    res.status(500).json({ error: "Error al agregar empleado." });
  }
}

async function actualizarEmpleado(req, res) {
  const { id } = req.params;
  const {
    nombre,
    apellido,
    cargo,
    empresaID,
    tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
    edad,
    genero,
    raza,
    estadoCivil,
    municipio,
    direccion,
    medioTransporte,
    celular,
    correo,
    contactoEmergencia,
    celularEmergencia
  } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    request.input("nombre", nombre);
    request.input("apellido", apellido);
    request.input("cargo", cargo);
    request.input("empresaID", empresaID);
    request.input("tipoDocumento", tipoDocumento);
    request.input("numeroDocumento", numeroDocumento);
    request.input("fechaNacimiento", fechaNacimiento);
    request.input("edad", edad);
    request.input("genero", genero);
    request.input("raza", raza);
    request.input("estadoCivil", estadoCivil);
    request.input("municipio", municipio);
    request.input("direccion", direccion);
    request.input("medioTransporte", medioTransporte);
    request.input("celular", celular);
    request.input("correo", correo);
    request.input("contactoEmergencia", contactoEmergencia);
    request.input("celularEmergencia", celularEmergencia);

    const query = `
      UPDATE Empleados
      SET Nombre = @nombre,
          Apellido = @apellido,
          Cargo = @cargo,
          EmpresaID = @empresaID,
          TipoDocumento = @tipoDocumento,
          NumeroDocumento = @numeroDocumento,
          FechaNacimiento = @fechaNacimiento,
          Edad = @edad,
          Genero = @genero,
          Raza = @raza,
          EstadoCivil = @estadoCivil,
          Municipio = @municipio,
          Direccion = @direccion,
          MedioTransporte = @medioTransporte,
          Celular = @celular,
          Correo = @correo,
          ContactoEmergencia = @contactoEmergencia,
          CelularEmergencia = @celularEmergencia,
          UpdatedAt = GETDATE()
      WHERE ID = @id;
      SELECT * FROM Empleados WHERE ID = @id;
    `;
    const result = await request.query(query);
    res.json({ empleado: result.recordset[0] });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar empleado." });
  }
}

async function eliminarEmpleado(req, res) {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    request.input("id", id);
    await request.query("DELETE FROM Empleados WHERE ID = @id");
    res.json({ message: "Empleado eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ error: "Error al eliminar empleado." });
  }
}

module.exports = {
  listarEmpleados,
  agregarEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
};
