import { obtenerConfig } from "../services/settingsService.js";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "supersecreto";

export async function maintenanceMiddleware(req, res, next) {
  try {
    // If requesting settings to CHECK maintenance, let it pass to avoid loops (or just ensure settings/public is public)
    // Public settings route is already public. 
    // This middleware is applied to API routes presumably.
    
    // Check global flag
    const status = await obtenerConfig("maintenance_mode");
    if (status !== 'true') return next();

    // Maintenance is ON.
    // Allow login requests to pass (so they can reach the controller which checks roles)
    // If we block login here, no one can log in to admin to turn it off!
    if (req.path.startsWith("/api/auth/login")) return next();
    if (req.path.startsWith("/api/settings/public")) return next(); // Frontend needs this to know maintenance is on

    // For other routes, we need to check if user is admin
    const token = req.cookies?.token;
    if (!token) {
        // No token, and not login -> Block
        return res.status(503).json({ error: "Mantenimiento activo. Acceso denegado." });
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        if (["superusuario", "administrador"].includes(decoded.rol)) {
             return next();
        }
    } catch(e) {}

    // Have token but not admin, or invalid token -> Block
    return res.status(503).json({ error: "Sistema en mantenimiento." });

  } catch (err) {
    console.error("Maintenance middleware error:", err);
    next(); // Fail open or closed? Usually fail open to avoid bricking, but here let's pass.
  }
}
