import { sql } from "../db/connection.js";

export async function obtenerLeadsPorUsuario(userId) {
  // Returns leads for all landings owned by the user
  return await sql`
    SELECT 
      ll.id, ll.landing_id, ll.type, ll.data, ll.created_at, ll.read_status,
      l.title as landing_title, l.slug as landing_slug
    FROM landing_leads ll
    JOIN landings l ON l.id = ll.landing_id
    WHERE l.user_id = ${userId}
    ORDER BY ll.created_at DESC
  `;
}
