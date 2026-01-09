import express from "express";
import jwt from "jsonwebtoken";
import { obtenerConfiguraciones, actualizarConfiguraciones, upsertConfig } from "../services/settingsService.js";
import { obtenerLandingPorSlug } from "../services/landingsService.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecreto";

// Middleware local para validar superusuario o admin
const requireAdmin = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "No autenticado" });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (!["superusuario", "administrador"].includes(decoded.rol.toLowerCase())) {
      return res.status(403).json({ error: "No autorizado" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Sesión inválida" });
  }
};

// GET /api/settings - Listar todas
router.get("/", requireAdmin, async (req, res) => {
  try {
    const settings = await obtenerConfiguraciones();
    // Agrupar por categoría
    const grouped = settings.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
    
    res.json(grouped);
  } catch (err) {
    console.error("Error obteniendo configuraciones:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// PUT /api/settings - Actualizar masivamente
router.put("/", requireAdmin, async (req, res) => {
  try {
    const updates = req.body; // Espera { "site_name": "Nuevo", "maintenance_mode": true }
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    const result = await actualizarConfiguraciones(updates);
    res.json({ success: true, updated: result.length });
  } catch (err) {
    console.error("Error actualizando configuraciones:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// GET /api/settings/public - Configuraciones públicas (si se necesitan en el login/home)
router.get("/public", async (req, res) => {
  try {
    const settings = await obtenerConfiguraciones();
    // Filtrar solo las que sean seguras de exponer (ej: site_name, colors)
    // Por ahora filtramos hardcoded
    const publicKeys = ['site_name', 'primary_color', 'allow_registration', 'support_email', 'demo_landing_slug'];
    
    const publicSettings = settings
      .filter(s => publicKeys.includes(s.key))
      .reduce((obj, s) => { 
        obj[s.key] = s.value; 
        return obj; 
      }, {});

    res.json(publicSettings);
  } catch (err) {
    res.status(500).json({ error: "Error" });
  }
});

// PUT /api/settings/demo-default - Establecer landing demo predeterminada (admin/super)
router.put("/demo-default", requireAdmin, async (req, res) => {
  try {
    const slug = (req.body?.slug || '').trim();
    if (!slug) return res.status(400).json({ error: "Slug requerido" });

    const landing = await obtenerLandingPorSlug(slug);
    if (!landing) return res.status(404).json({ error: "Landing no encontrada" });
    if (!landing.is_public) {
      return res.status(400).json({ error: "La landing debe estar Pública para usarla como demo" });
    }

    const saved = await upsertConfig({
      key: 'demo_landing_slug',
      value: slug,
      type: 'string',
      category: 'landings',
      label: 'Landing demo predeterminada',
      description: 'Slug de la landing usada como demo en /pages/demo y como demo inicial del editor.'
    });

    return res.json({ success: true, key: saved.key, value: saved.value });
  } catch (err) {
    console.error('Error guardando demo-default:', err);
    return res.status(500).json({ error: "Error interno" });
  }
});

export default router;
