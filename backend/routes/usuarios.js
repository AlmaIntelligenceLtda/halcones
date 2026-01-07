import express from "express";
import jwt from "jsonwebtoken";
import { 
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  eliminarUsuario,
  crearUsuario,
  actualizarUsuario
} from "../services/usuariosService.js";
import { verificarCredencialesEmail } from "../services/authService.js";

const router = express.Router();

// GET /api/usuarios
router.get("/", async (_req, res) => {
  try {
    const usuarios = await obtenerTodosLosUsuarios();
    res.json(usuarios);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// GET /api/usuarios/:id
router.get("/:id", async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (err) {
    console.error("❌ Error al obtener usuario:", err);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// POST /api/usuarios
router.post("/", async (req, res) => {
  try {
    const nuevo = await crearUsuario(req.body);
    res.json(nuevo); // ✅ ya devuelve objeto
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// PUT /api/usuarios/:id
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await actualizarUsuario(req.params.id, req.body);
    if (!actualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(actualizado);
  } catch (err) {
    console.error("❌ Error al actualizar usuario:", err);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// DELETE /api/usuarios/:id
const SECRET = process.env.JWT_SECRET || "supersecreto";

router.delete("/:id", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "No autenticado" });

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (e) {
      return res.status(403).json({ error: "Token inválido" });
    }

    const rol = String(decoded.rol || "").toLowerCase();
    if (rol !== "superusuario") {
      return res.status(403).json({ error: "Acceso denegado: se requiere rol superusuario" });
    }

    const { clave } = req.body || {};
    if (!clave) return res.status(400).json({ error: "Clave requerida" });

    const email = decoded.email;
    const verif = await verificarCredencialesEmail(email, clave);
    if (!verif.ok) {
      return res.status(401).json({ error: "Clave incorrecta" });
    }

    await eliminarUsuario(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});





export default router;
