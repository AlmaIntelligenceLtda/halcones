import { sql } from "../db/connection.js";

const ALLOWED_ROLES = new Set(["superusuario", "cliente"]);

export async function verificarCredencialesEmail(email, password) {
  if (!email || !password) {
    console.log("❌ Faltan datos de login:", { email, password });
    return { ok: false, reason: "missing_fields" };
  }

  const emailSanitizado = email.trim().toLowerCase();
  const passSanitizada = password.trim();

  /* Validar dominio @halcones.cl (DESHABILITADO)
  if (!emailSanitizado.endsWith("@halcones.cl")) {
    console.warn("❌ Correo no permitido:", emailSanitizado);
    return { ok: false, reason: "invalid_email_domain" };
  }
  */

  const rows = await sql`
    SELECT id, email, password, rol, activo, nombres, apellidos
    FROM usuarios
    WHERE email = ${emailSanitizado}
    LIMIT 1
  `;

  if (rows.length === 0) {
    console.warn("❌ Usuario no encontrado:", emailSanitizado);
    return { ok: false, reason: "user_not_found" };
  }

  const user = rows[0];

  if (!user.activo) {
    console.warn("❌ Usuario inactivo:", user.email);
    return { ok: false, reason: "inactive_user" };
  }

  const passOk = user.password === passSanitizada;

  if (!passOk) {
    console.warn("❌ Contraseña incorrecta para:", user.email);
    return { ok: false, reason: "wrong_password" };
  }

  const rolNorm = String(user.rol || "").toLowerCase();
  if (!ALLOWED_ROLES.has(rolNorm)) {
    console.warn("❌ Rol no admitido:", user.rol);
    return { ok: false, reason: "role_not_allowed", detail: { rol: user.rol } };
  }

  const { password: _, ...safeUser } = user;
  return { ok: true, user: { ...safeUser, rol: rolNorm } };
}




// import { sql } from "../db/connection.js";

// const ALLOWED_ROLES = new Set(["administrador", "superusuario", "visualizador"]);

// export async function verificarCredenciales(rut, password) {
//   if (!rut || !password) {
//     console.log("❌ Faltan datos de login:", { rut, password });
//     return { ok: false, reason: "missing_fields" };
//   }

//   const rutSanitizado = rut.trim();
//   const passSanitizada = password.trim();

//   const rows = await sql`
//     SELECT id, rut, password, rol, activo, nombres, apellidos
//     FROM usuarios
//     WHERE rut = ${rutSanitizado}
//     LIMIT 1
//   `;

//   if (rows.length === 0) {
//     console.warn("❌ Usuario no encontrado:", rutSanitizado);
//     return { ok: false, reason: "user_not_found" };
//   }

//   const user = rows[0];

//   if (!user.activo) {
//     console.warn("❌ Usuario inactivo:", user.rut);
//     return { ok: false, reason: "inactive_user" };
//   }

//   const passOk = user.password === passSanitizada;

//   if (!passOk) {
//     console.warn("❌ Contraseña incorrecta para:", user.rut);
//     return { ok: false, reason: "wrong_password" };
//   }

//   const rolNorm = String(user.rol || "").toLowerCase();
//   if (!ALLOWED_ROLES.has(rolNorm)) {
//     console.warn("❌ Rol no admitido:", user.rol);
//     return { ok: false, reason: "role_not_allowed", detail: { rol: user.rol } };
//   }

//   const { password: _, ...safeUser } = user;
//   return { ok: true, user: { ...safeUser, rol: rolNorm } };
// }
