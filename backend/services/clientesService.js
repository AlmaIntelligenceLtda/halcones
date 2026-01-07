import { sql } from "../db/connection.js";

// ============================
// 📦 CRUD: clientes
// ============================

export async function obtenerTodosLosClientes() {
  return await sql`
    SELECT id, rut, nombre, direccion, ciudad, comuna, telefono, email, foto
    FROM clientes
    ORDER BY id DESC
  `;
}

export async function obtenerClientePorId(id) {
  const [row] = await sql`
    SELECT id, rut, nombre, direccion, ciudad, comuna, telefono, email, foto
    FROM clientes
    WHERE id = ${id}
    LIMIT 1
  `;
  return row || null;
}

export async function crearCliente({ rut, nombre, direccion, ciudad, comuna, telefono, email, foto }) {
  const [row] = await sql`
    INSERT INTO clientes (rut, nombre, direccion, ciudad, comuna, telefono, email, foto)
    VALUES (${rut}, ${nombre}, ${direccion}, ${ciudad}, ${comuna}, ${telefono}, ${email}, ${foto})
    RETURNING id, rut, nombre, direccion, ciudad, comuna, telefono, email, foto
  `;
  return row;
}

export async function actualizarCliente(id, { rut, nombre, direccion, ciudad, comuna, telefono, email, foto, fotoActual }) {
  // Si no se proporciona foto (archivo nuevo), mantener fotoActual
  const fotoFinal = foto || fotoActual || null;

  const [row] = await sql`
    UPDATE clientes
    SET rut = ${rut}, nombre = ${nombre}, direccion = ${direccion}, ciudad = ${ciudad}, comuna = ${comuna}, telefono = ${telefono}, email = ${email}, foto = ${fotoFinal}
    WHERE id = ${id}
    RETURNING id, rut, nombre, direccion, ciudad, comuna, telefono, email, foto
  `;
  return row || null;
}

export async function eliminarCliente(id) {
  const [row] = await sql`
    DELETE FROM clientes
    WHERE id = ${id}
    RETURNING id
  `;
  return row || null;
}
