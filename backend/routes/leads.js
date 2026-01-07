import express from "express";
import jwt from "jsonwebtoken";
import { obtenerLeadsPorUsuario } from "../services/leadsService.js";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "supersecreto";

function verifyToken(req) {
  const token = req.cookies?.token;
  if (!token) throw new Error("NO_TOKEN");
  return jwt.verify(token, SECRET);
}

// GET /api/leads
router.get("/", async (req, res) => {
  try {
    const decoded = verifyToken(req);
    const leads = await obtenerLeadsPorUsuario(decoded.id);
    res.json(leads);
  } catch (err) {
    if (err.message === "NO_TOKEN" || err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "No autenticado" });
    }
    console.error("Error obteniendo leads:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
