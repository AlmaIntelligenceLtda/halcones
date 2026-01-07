import express from "express";
import jwt from "jsonwebtoken";
import { obtenerEstadisticasUsuario, obtenerMetricasGlobales } from "../services/reportesService.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecreto";

function verifyToken(req) {
  const token = req.cookies?.token;
  if (!token) throw new Error("NO_TOKEN");
  return jwt.verify(token, SECRET);
}

// GET /api/reportes/dashboard
router.get("/dashboard", async (req, res) => {
  try {
    const decoded = verifyToken(req);
    // userId lo sacamos del token decodificado
    const stats = await obtenerEstadisticasUsuario(decoded.id);
    res.json(stats);
  } catch (err) {
    if (err.message === "NO_TOKEN" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "No autenticado" });
    }
    console.error("Error en reporte dashboard:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

// GET /api/reportes/global
router.get("/global", async (req, res) => {
  try {
    const decoded = verifyToken(req);
    if (!["superusuario", "administrador"].includes(decoded.rol)) {
        return res.status(403).json({ error: "No autorizado" });
    }
    const stats = await obtenerMetricasGlobales();
    res.json(stats);
  } catch (err) {
    console.error("Error en reporte global:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
