import { sql } from "../db/connection.js";

// ============================
// 📦 CRUD: usuarios
// ============================

// 🔹 Obtener todos los usuarios
export async function obtenerTodosLosUsuarios() {
  return await sql`
    SELECT 
      id, 
      rut, 
      nombres, 
      apellidos, 
      email, 
      rol, 
      activo
    FROM usuarios
    ORDER BY id DESC
  `;
}

// 🔹 Obtener usuario por ID
export async function obtenerUsuarioPorId(id) {
  const [row] = await sql`
    SELECT 
      id, 
      rut, 
      nombres, 
      apellidos, 
      email,
      rol, 
      activo, 
      password
    FROM usuarios
    WHERE id = ${id}
    LIMIT 1
  `;
  return row || null;
}

// 🔹 Crear usuario
export async function crearUsuario({ rut, nombres, apellidos, email, rol, password, activo = true }) {
  const [row] = await sql`
    INSERT INTO usuarios (rut, nombres, apellidos, email, rol, password, activo)
    VALUES (${rut}, ${nombres}, ${apellidos}, ${email}, ${rol}, ${password}, ${activo})
    RETURNING id, rut, nombres, apellidos, email, rol, activo
  `;
  return row;
}

// 🔹 Actualizar usuario
export async function actualizarUsuario(id, { rut, nombres, apellidos, email, rol, password, activo }) {
  let row;
  if (password) {
    [row] = await sql`
      UPDATE usuarios
      SET 
        nombres = ${nombres},
        apellidos = ${apellidos},
        email = ${email},
        rol = ${rol},
        activo = ${activo},
        password = ${password}
      WHERE id = ${id}
      RETURNING id, rut, nombres, apellidos, email, rol, activo
    `;
  } else {
    [row] = await sql`
      UPDATE usuarios
      SET 
        nombres = ${nombres},
        apellidos = ${apellidos},
        email = ${email},
        rol = ${rol},
        activo = ${activo}
      WHERE id = ${id}
      RETURNING id, rut, nombres, apellidos, email, rol, activo
    `;
  }
  return row || null;
}

// 🔹 Eliminar usuario
export async function eliminarUsuario(id) {
  const [row] = await sql`
    DELETE FROM usuarios
    WHERE id = ${id}
    RETURNING id
  `;
  return row || null;
}


