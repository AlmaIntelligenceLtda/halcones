import express from "express";
import jwt from "jsonwebtoken";
import { obtenerConfiguraciones, actualizarConfiguraciones } from "../services/settingsService.js";

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
    const publicKeys = ['site_name', 'primary_color', 'allow_registration', 'support_email'];
    
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

export default router;
