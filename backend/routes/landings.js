import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import {
  crearLanding,
  obtenerTodasLasLandings,
  obtenerLandingPorSlug,
  listarLandingsPublicos,
  obtenerLandingsPorUsuario,
  actualizarLanding,
  crearMedia,
  eliminarMedia,
  registrarLead
} from "../services/landingsService.js";
import { registrarVisita } from "../services/reportesService.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecreto";

// GET /api/landings/all (Landings totales para admin/superusuario)
router.get("/all", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "No autenticado" });

    // Verificar token para roles
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch {
      return res.status(403).json({ error: "Token inválido" });
    }

    const { rol } = decoded;
    // Ajustar roles permitidos según necesidad, asumo altos privilegios
    if (!["superusuario", "administrador", "supervisor"].includes(rol)) {
      return res.status(403).json({ error: "No autorizado" });
    }

    const landings = await obtenerTodasLasLandings();
    res.json(landings);
  } catch (err) {
    console.error("Error al obtener landings totales:", err);
    res.status(500).json({ error: "Error interno" });
  }
});


// NOTE: ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads", "landings");
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`)
});

// File validation and limits
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    return cb(new Error("INVALID_FILE_TYPE"));
  }
});

// Public: list public landings
router.get("/public", async (req, res) => {
  try {
    const list = await listarLandingsPublicos();
    res.json(list);
  } catch (err) {
    console.error("❌ Error listando landings públicos:", err);
    res.status(500).json({ error: "Error listando landings" });
  }
});

// Public: Submit Lead (Form or Pricing)
router.post("/:id/lead", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, data } = req.body;
    
    // Basic val
    if (!type || !data) return res.status(400).json({ error: "Faltan datos" });

    // TODO: Verify if landing exists (optional, database will FK fail)
    
    await registrarLead(id, type, data);
    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error registrando lead:", err);
    res.status(500).json({ error: "Error guardando contacto" });
  }
});

// Public: get by slug
router.get("/slug/:slug", async (req, res) => {
  try {
    const landing = await obtenerLandingPorSlug(req.params.slug);
    if (!landing || !landing.is_public) return res.status(404).json({ error: "Landing no encontrada" });

    // Registrar visita de forma asíncrona (no bloqueante)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    registrarVisita(landing.id, ip, req.get('User-Agent'), req.get('Referer'))
      .catch(e => console.error("Error registrando visita:", e));

    res.json(landing);
  } catch (err) {
    console.error("❌ Error obteniendo landing por slug:", err);
    res.status(500).json({ error: "Error obteniendo landing" });
  }
});

// Auth helper
function verifyToken(req) {
  const token = req.cookies?.token;
  if (!token) throw new Error("NO_TOKEN");
  return jwt.verify(token, SECRET);
}

// Auth: get landing by slug for editor (owner)
router.get("/editor/:slug", async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const landing = await obtenerLandingPorSlug(req.params.slug);
    
    if (!landing) return res.status(404).json({ error: "Landing no encontrada" });
    
    // Check ownership
    if (landing.user_id !== decoded.id && decoded.rol !== 'superusuario') {
      return res.status(403).json({ error: "No tienes permiso" });
    }
    
    res.json(landing);
  } catch (err) {
    console.error("❌ Error obteniendo landing para editor:", err);
    res.status(500).json({ error: "Error obteniendo landing" });
  }
});

// Auth: get user's landings
router.get("/", async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded.id;
    const list = await obtenerLandingsPorUsuario(userId);
    res.json(list);
  } catch (err) {
    console.warn("Unauthorized /api/landings:", err?.message);
    return res.status(401).json({ error: "No autenticado" });
  }
});

// Auth: create landing
router.post("/", async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const userId = decoded.id;
    const { title, slug, description, is_public = true, data = {} } = req.body;
    const created = await crearLanding({ user_id: userId, title, slug, description, is_public, data });
    res.json(created);
  } catch (err) {
    console.error("❌ Error creando landing:", err);
    res.status(500).json({ error: "Error creando landing" });
  }
});

// Auth: update landing
router.put("/:id", async (req, res) => {
  try {
    verifyToken(req);
    const id = Number(req.params.id);
    const updated = await actualizarLanding(id, req.body);
    if (!updated) return res.status(404).json({ error: "Landing no encontrada" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error actualizando landing:", err);
    res.status(500).json({ error: "Error actualizando landing" });
  }
});

// Auth: upload media (images/videos)
router.post("/:id/media", upload.single("file"), async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const landingId = Number(req.params.id);
    if (!req.file) return res.status(400).json({ error: "Archivo requerido" });
    const filename = req.file.filename;
    const relPath = `/uploads/landings/${filename}`;

    // If image, generate thumbnail
    if (req.file.mimetype.startsWith("image/")) {
      try {
        const thumbsDir = path.join(uploadsDir, "thumbs");
        fs.mkdirSync(thumbsDir, { recursive: true });
        const thumbPath = path.join(thumbsDir, `thumb-${filename}`);
        await sharp(req.file.path).resize(400, null, { withoutEnlargement: true }).toFile(thumbPath);
      } catch (thumbErr) {
        console.warn("Warning: thumbnail generation failed:", thumbErr?.message || thumbErr);
      }
    }

    const media = await crearMedia(landingId, { type: req.body.type || (req.file.mimetype.startsWith("image/") ? "image" : "video"), path: relPath, metadata: { mimetype: req.file.mimetype, size: req.file.size }, position: Number(req.body.position) || 0 });
    res.json(media);
  } catch (err) {
    console.error("❌ Error subiendo media:", err);
    res.status(500).json({ error: "Error subiendo media" });
  }
});

// Auth: delete media
router.delete("/media/:id", async (req, res) => {
  try {
    verifyToken(req);
    const ok = await eliminarMedia(Number(req.params.id));
    res.json({ success: !!ok });
  } catch (err) {
    console.error("❌ Error eliminando media:", err);
    res.status(500).json({ error: "Error eliminando media" });
  }
});

export default router;
