import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import usuariosRoutes from "./routes/usuarios.js";
import ablyRoutes from "./routes/ably.js";
import authRoutes from "./routes/auth.js";
import landingsRoutes from "./routes/landings.js";
import reportesRoutes from "./routes/reportes.js";
import leadsRoutes from "./routes/leads.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

// Inicializar Ably (realtime) si está disponible en env
import { initAbly } from "./lib/ably.js";
import { obtenerConfig } from "./services/settingsService.js";
import { maintenanceMiddleware } from "./middleware/maintenance.js";
initAbly();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// 👉 Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, "../frontend")));
// Servir uploads públicos (imágenes/videos subidos por usuarios)
app.use('/uploads', express.static(path.join(__dirname, "../uploads")));

// Middleware para proteger rutas
const SECRET = process.env.JWT_SECRET || "supersecreto";

async function requireAuth(req, res, next) {
  // Allow unauthenticated access to public routes and static assets
  const publicPrefixes = ["/assets", "/uploads", "/js", "/css", "/images"];
  const publicExact = ["/", "/home.html", "/login.html", "/register.html", "/members"];

  if (publicExact.includes(req.path)) return next();
  if (req.path.startsWith("/pages/")) return next();
  if (req.path.startsWith("/api/auth/login")) return next();
  if (req.path.startsWith("/api/auth/register")) return next();
  
  // 🛡️ CHECK: Maintenance Mode
  try {
    const isMaintenance = await obtenerConfig("maintenance_mode");
    if (isMaintenance === "true") {
       // If token exists, check role. If not, deny.
       const token = req.cookies?.token;
       if (!token) {
           // Not logged in + maintenance = 503 or redirect
           // If request is API or Asset, sending JSON is better. If HTML, redirect to maintenance page.
           if (req.path.startsWith("/api/")) return res.status(503).json({ error: "Servidor en mantenimiento" });
           // Could serve a static maintenance file here
           return res.send("<h1>Sitio en mantenimiento</h1><p>Vuelve más tarde.</p>");
       }
       
       // Verify token level
       const decoded = jwt.verify(token, SECRET);
       if (!["superusuario", "administrador"].includes(decoded.rol)) {
           return res.status(503).send("<h1>Mantenimiento</h1><p>Tu rol no tiene acceso durante el mantenimiento.</p>");
       }
       // If admin/super, allow passage
    }
  } catch (err) {
      // If error (e.g. invalid token during maintenance check), redirect login
      if (err.name === 'JsonWebTokenError') return res.redirect("/login.html");
      console.error("Maintenance check error:", err);
  }

  for (const p of publicPrefixes) if (req.path.startsWith(p)) return next();

  const token = req.cookies?.token;
  if (!token) {
    console.log(`[requireAuth] no token — path=${req.path} → redirect /login.html`);
    return res.redirect("/login.html");
  }
  try {
    jwt.verify(token, SECRET);
    console.log(`[requireAuth] token ok — path=${req.path} → allow`);
    return next();
  } catch (err) {
    console.log(`[requireAuth] token invalid — path=${req.path} err=${err?.message || err}`);
    return res.redirect("/login.html");
  }
}

// Debug endpoint to inspect auth behavior quickly (temporary)
app.get('/._debug_auth', (req, res) => {
  try {
    const token = req.cookies?.token || null;
    return res.json({ ok: true, path: req.path, hasToken: !!token });
  } catch (err) {
    return res.json({ ok: false, error: String(err) });
  }
});

// 👉 Rutas API
app.use(maintenanceMiddleware); // Apply global maintenance check for APIs
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/ably", ablyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/landings", landingsRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/settings", settingsRoutes);

// 👉 Ruta principal → servir página de inicio pública
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/home.html"));
});

// 👉 Home protegido en /dashboard
app.get("/dashboard", requireAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 👉 Si alguien entra a /index.html → redirigir al slug
app.get("/index.html", (req, res) => {
  res.redirect("/dashboard");
});

// Public page for a landing by slug (no auth)
app.get("/pages/:slug", (req, res) => {
  if (req.params.slug === "demo") {
    return res.sendFile(path.join(__dirname, "../frontend/demo.html"));
  }
  res.sendFile(path.join(__dirname, "../frontend/p.html"));
});

// Public members listing
app.get("/members", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/members.html"));
});

// 👉 Rutas desconocidas → también sirven index.html (SPA)
app.get("*", requireAuth, (req, res) => {
  res.set("Cache-Control", "no-store");
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
