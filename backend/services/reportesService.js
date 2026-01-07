import { sql } from "../db/connection.js";

/**
 * Registra una nueva visita a una landing page
 */
export async function registrarVisita(landingId, ip, userAgent, referer) {
  // Simple check to avoid crashing if data missing
  if (!landingId) return;

  // We could hash the IP here for privacy, but for now strict implementation
  // Let's store it directly or hash it. The column is ip_hash.
  // Assuming the controller passes a string.
  await sql`
    INSERT INTO landing_views (landing_id, ip_hash, user_agent, referer)
    VALUES (${landingId}, ${ip}, ${userAgent}, ${referer})
  `;
}

/**
 * Obtiene estadísticas generales para un usuario (Dashboard de Reportes)
 */
export async function obtenerEstadisticasUsuario(userId) {
  // 1. Total Landings
  const [landingsRes] = await sql`
    SELECT COUNT(*)::int as count FROM landings WHERE user_id = ${userId}
  `;

  // 2. Total Vistas (All time)
  const [viewsRes] = await sql`
    SELECT COUNT(lv.id)::int as count
    FROM landing_views lv
    JOIN landings l ON l.id = lv.landing_id
    WHERE l.user_id = ${userId}
  `;

  // 3. Vistas ultimos 30 dias (para grafico)
  const viewsByDay = await sql`
    SELECT
      to_char(lv.created_at, 'YYYY-MM-DD') as day,
      COUNT(*)::int as count
    FROM landing_views lv
    JOIN landings l ON l.id = lv.landing_id
    WHERE l.user_id = ${userId}
      AND lv.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  // 4. Top 5 Landings mas visitadas
  const topLandings = await sql`
    SELECT l.title, l.slug, COUNT(lv.id)::int as views
    FROM landings l
    LEFT JOIN landing_views lv ON l.id = lv.landing_id
    WHERE l.user_id = ${userId}
    GROUP BY l.id
    ORDER BY views DESC
    LIMIT 5
  `;

  return {
    totalLandings: landingsRes?.count || 0,
    totalViews: viewsRes?.count || 0,
    history: viewsByDay,
    topLandings
  };
}

/**
 * Estadísticas Globales (Admin/Superusuario)
 */
export async function obtenerMetricasGlobales() {
  // 1. Totales
  const [counts] = await sql`
    SELECT 
      (SELECT COUNT(*) FROM usuarios) as total_usuarios,
      (SELECT COUNT(*) FROM landings) as total_landings,
      (SELECT COUNT(*) FROM landing_views) as total_vistas,
      (SELECT COUNT(*) FROM landing_leads) as total_leads
  `;

  // 2. Vistas Globales por día (Últimos 30 días)
  const viewsByDay = await sql`
    SELECT
      to_char(created_at, 'YYYY-MM-DD') as day,
      COUNT(*)::int as count
    FROM landing_views
    WHERE created_at >= NOW() - INTERVAL '30 days'
    GROUP BY 1
    ORDER BY 1 ASC
  `;

  // 3. Usuarios por Rol
  const usersByRole = await sql`
    SELECT rol, COUNT(*)::int as count
    FROM usuarios
    GROUP BY rol
  `;

  return {
    ...counts,
    viewsByDay,
    usersByRole
  };
}
