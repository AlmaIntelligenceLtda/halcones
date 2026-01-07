import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { verificarCredencialesEmail } from "../services/authService.js";
import { crearUsuario } from "../services/usuariosService.js";
import { obtenerConfig } from "../services/settingsService.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecreto";

router.use(cookieParser());

/* ===============================
   LOGIN DASHBOARD (EMAIL) → POST /api/auth/login
================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check maintenance
    const isMaintenance = await obtenerConfig("maintenance_mode");
    const result = await verificarCredencialesEmail(email, password);

    if (!result.ok) return manejarErrores(result, res);

    const safeUser = result.user;
    
    if (isMaintenance === 'true' && !["superusuario", "administrador"].includes(safeUser.rol)) {
       return res.status(503).json({ success: false, message: "Sitio en mantenimiento. Acceso restringido." });
    }

    const token = jwt.sign(safeUser, SECRET, { expiresIn: "2h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // ⚠️ en producción => true con HTTPS
      sameSite: "lax"
    });
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("❌ Error en /api/auth/login:", err);
    return res.status(500).json({
      success: false,
      code: "AUTH_INTERNAL_ERROR",
      message: "Error interno de autenticación"
    });
  }
});

/* ===============================
   LOGIN POR QR FÍSICO → POST /api/auth/qr-login
   Body: { qr_id }
   - Usa identificador opaco del usuario
   - No expone rut ni password
================================= */
router.post("/qr-login", async (req, res) => {
  try {
    const { qr_id } = req.body || {};
    if (!qr_id || typeof qr_id !== "string") {
      return res.status(400).json({ success:false, message:"qr_id requerido" });
    }
    if (!usuario.activo) {
      return res.status(403).json({ success:false, message:"Usuario inactivo" });
    }

    // Generar JWT con los mismos datos seguros
    const token = jwt.sign(usuario, SECRET, { expiresIn: "2h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });
    return res.json({ success:true, user: usuario });
  } catch (err) {
    console.error("❌ Error en /api/auth/qr-login:", err);
    return res.status(500).json({ success:false, message:"Error interno de autenticación QR" });
  }
});

/* ===============================
   PROFILE → GET /api/auth/me
================================= */
router.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, message: "No autenticado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    res.json({ success: true, user: decoded });
  } catch (err) {
    res.status(403).json({ success: false, message: "Token inválido" });
  }
});

/* ===============================
   LOGOUT → POST /api/auth/logout
================================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  console.log("🔒 Sesión cerrada");
  res.json({ success: true, message: "Sesión cerrada" });
});

/* ===============================
   REGISTER → POST /api/auth/register
   Body: { nombres, apellidos, email, password }
   - Creates user with default role `visualizador` and auto-logins (cookie)
================================= */
router.post("/register", async (req, res) => {
  try {
    // 1) Chequear configuración global de registro
    const allowRegistration = await obtenerConfig("allow_registration");
    if (allowRegistration === "false") {
      return res.status(403).json({ success: false, code: "REGISTRATION_DISABLED", message: "El registro de nuevos usuarios está deshabilitado temporalmente." });
    }

    const { nombres, apellidos, email, password } = req.body || {};
    if (!nombres || !apellidos || !email || !password) {
      return res.status(400).json({ success: false, code: "MISSING_FIELDS", message: "Faltan campos requeridos" });
    }

    const emailSan = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailSan)) {
      return res.status(400).json({ success: false, code: "INVALID_EMAIL", message: "Email inválido" });
    }

    /* Keep same domain restriction as login flow (DESHABILITADO)
    if (!emailSan.endsWith("@halcones.cl")) {
      return res.status(400).json({ success: false, code: "INVALID_EMAIL_DOMAIN", message: "El correo debe ser institucional (@halcones.cl)" });
    }
    */

    // Default role allowed by authService
    const rol = "cliente";

    // crearUsuario expects rut; allow null for registration flow
    const nuevo = await crearUsuario({ rut: null, nombres, apellidos, email: emailSan, rol, password, activo: true });

    // Auto-login: create JWT and set cookie
    const safeUser = { id: nuevo.id, email: nuevo.email, rol: String(nuevo.rol || rol).toLowerCase(), nombres: nuevo.nombres, apellidos: nuevo.apellidos };
    const token = jwt.sign(safeUser, SECRET, { expiresIn: "2h" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });
    return res.json({ success: true, user: safeUser });
  } catch (err) {
    console.error("❌ Error en /api/auth/register:", err);
    if (err?.code === "23505") {
      return res.status(409).json({ success: false, code: "EMAIL_EXISTS", message: "Ya existe un usuario con ese email" });
    }
    return res.status(500).json({ success: false, code: "REGISTER_ERROR", message: "Error creando usuario" });
  }
});

/* ===============================
   REGISTER SUPERUSER (HIDDEN) → POST /api/auth/register-superuser
================================= */
router.post("/register-superuser", async (req, res) => {
  try {
    const { nombres, apellidos, email, password, masterKey } = req.body || {};
    const VALID_MASTER_KEY = process.env.MASTER_KEY || "halcones_super_2026";

    if (masterKey !== VALID_MASTER_KEY) {
        return res.status(403).json({ success: false, message: "Llave maestra incorrecta" }); 
    }

    if (!nombres || !apellidos || !email || !password) {
      return res.status(400).json({ success: false, code: "MISSING_FIELDS", message: "Faltan campos requeridos" });
    }

    const emailSan = String(email).trim().toLowerCase();

    // Crear como superusuario
    const rol = "superusuario";

    const nuevo = await crearUsuario({ rut: null, nombres, apellidos, email: emailSan, rol, password, activo: true });

    // Auto-login
    const safeUser = { id: nuevo.id, email: nuevo.email, rol, nombres: nuevo.nombres, apellidos: nuevo.apellidos };
    const token = jwt.sign(safeUser, SECRET, { expiresIn: "2h" });
    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax" });

    return res.json({ success: true, user: safeUser });

  } catch (err) {
    console.error("❌ Error en /api/auth/register-superuser:", err);
    if (err?.code === "23505") {
      return res.status(409).json({ success: false, code: "EMAIL_EXISTS", message: "Ya existe un usuario con ese email" });
    }
    return res.status(500).json({ success: false, code: "REGISTER_ERROR", message: "Error creando superusuario" });
  }
});

/* ===============================
   Helper centralizado de errores
================================= */
function manejarErrores(result, res) {
  switch (result.reason) {
    case "missing_fields":
      return res.status(400).json({ success: false, code: "MISSING_FIELDS", message: "Debes ingresar correo y contraseña" });
    case "user_not_found":
      return res.status(404).json({ success: false, code: "USER_NOT_FOUND", message: "Usuario no encontrado" });
    case "inactive_user":
      return res.status(403).json({ success: false, code: "INACTIVE_USER", message: "Usuario no activado" });
    case "wrong_password":
      return res.status(401).json({ success: false, code: "WRONG_PASSWORD", message: "Contraseña incorrecta" });
    case "role_not_allowed":
      return res.status(403).json({
        success: false,
        code: "ROLE_NOT_ALLOWED",
        message: `Rol no admitido (${result.detail?.rol ?? "desconocido"})`
      });
    case "invalid_email_domain":
      return res.status(400).json({
        success: false,
        code: "INVALID_EMAIL",
        message: "El correo debe ser institucional (@correo.cl)"
      });
    default:
      return res.status(401).json({ success: false, code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" });
  }
}

export default router;















// import express from "express";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
// import { verificarCredenciales } from "../services/authService.js";

// const router = express.Router();
// const SECRET = process.env.JWT_SECRET || "supersecreto";

// router.use(cookieParser());

// // LOGIN → POST /api/auth/login
// router.post("/login", async (req, res) => {
//   try {
//     const { rut, password } = req.body;

//     const result = await verificarCredenciales(rut, password);

//     if (!result.ok) {
//       switch (result.reason) {
//         case "missing_fields":
//           return res.status(400).json({ success: false, code: "MISSING_FIELDS", message: "Credenciales incompletas" });
//         case "user_not_found":
//           return res.status(404).json({ success: false, code: "USER_NOT_FOUND", message: "Usuario no encontrado" });
//         case "inactive_user":
//           return res.status(403).json({ success: false, code: "INACTIVE_USER", message: "Usuario no activado" });
//         case "wrong_password":
//           return res.status(401).json({ success: false, code: "WRONG_PASSWORD", message: "Contraseña incorrecta" });
//         case "role_not_allowed":
//           return res.status(403).json({
//             success: false,
//             code: "ROLE_NOT_ALLOWED",
//             message: `Rol no admitido (${result.detail?.rol ?? "desconocido"})`
//           });
//         default:
//           return res.status(401).json({ success: false, code: "INVALID_CREDENTIALS", message: "Credenciales inválidas" });
//       }
//     }

//     const safeUser = result.user;

//     // Generar JWT
//     const token = jwt.sign(safeUser, SECRET, { expiresIn: "2h" });

//     // Enviar cookie HttpOnly
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false, // ⚠️ en producción => true con HTTPS
//       sameSite: "lax"
//     });

//     console.log("✅ Login exitoso:", safeUser.rut, "-", safeUser.rol);
//     return res.json({ success: true, user: safeUser });

//   } catch (err) {
//     console.error("❌ Error en /api/auth/login:", err);
//     return res.status(500).json({ success: false, code: "AUTH_INTERNAL_ERROR", message: "Error interno de autenticación" });
//   }
// });

// // PROFILE → GET /api/auth/me
// router.get("/me", (req, res) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ success: false, message: "No autenticado" });

//   try {
//     const decoded = jwt.verify(token, SECRET);
//     res.json({ success: true, user: decoded });
//   } catch (err) {
//     res.status(403).json({ success: false, message: "Token inválido" });
//   }
// });

// // LOGOUT → POST /api/auth/logout
// router.post("/logout", (req, res) => {
//   res.clearCookie("token");
//   console.log("🔒 Sesión cerrada");
//   res.json({ success: true, message: "Sesión cerrada" });
// });

// export default router;
