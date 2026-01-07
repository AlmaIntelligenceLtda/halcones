import { sql } from "../db/connection.js";

// ======= Landings service (CRUD + media)
export async function crearLanding({ user_id, title, slug, description, is_public = true, data = {} }) {
  const [row] = await sql`
    INSERT INTO landings (user_id, title, slug, description, is_public, data)
    VALUES (${user_id}, ${title}, ${slug}, ${description}, ${is_public}, ${data})
    RETURNING id, user_id, title, slug, description, is_public, data, created_at
  `;
  return row;
}

export async function registrarLead(landingId, type, data) {
  const [row] = await sql`
    INSERT INTO landing_leads (landing_id, type, data)
    VALUES (${landingId}, ${type}, ${data})
    RETURNING *
  `;
  return row;
}

export async function obtenerLandingPorSlug(slug) {
  const [landing] = await sql`
    SELECT id, user_id, title, slug, description, is_public, data, created_at
    FROM landings
    WHERE slug = ${slug}
    LIMIT 1
  `;
  if (!landing) return null;

  const media = await sql`
    SELECT id, type, path, url, metadata, position, created_at
    FROM landing_media
    WHERE landing_id = ${landing.id}
    ORDER BY position ASC, id ASC
  `;

  return { ...landing, media };
}

export async function listarLandingsPublicos(limit = 20, offset = 0) {
  return await sql`
    SELECT id, user_id, title, slug, description, created_at
    FROM landings
    WHERE is_public = true
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;
}

export async function obtenerLandingsPorUsuario(userId) {
  return await sql`
    SELECT id, user_id, title, slug, description, is_public, created_at
    FROM landings
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
}

export async function actualizarLanding(id, fields = {}) {
  const { title, description, is_public, data, slug } = fields;
  const [row] = await sql`
    UPDATE landings
    SET title = ${title}, description = ${description}, is_public = ${is_public}, data = ${data}, slug = ${slug}, updated_at = now()
    WHERE id = ${id}
    RETURNING id, user_id, title, slug, description, is_public, data, updated_at
  `;
  return row || null;
}

export async function crearMedia(landingId, { type, path, url = null, metadata = {}, position = 0 }) {
  const [row] = await sql`
    INSERT INTO landing_media (landing_id, type, path, url, metadata, position)
    VALUES (${landingId}, ${type}, ${path}, ${url}, ${metadata}, ${position})
    RETURNING id, landing_id, type, path, url, metadata, position, created_at
  `;
  return row;
}

export async function eliminarMedia(id) {
  const [row] = await sql`
    DELETE FROM landing_media WHERE id = ${id} RETURNING id
  `;
  return !!row;
}

export async function obtenerTodasLasLandings() {
  return await sql`
    SELECT 
      l.id, 
      l.user_id, 
      l.title, 
      l.slug, 
      l.is_public, 
      l.created_at,
      u.nombres as usuario_nombres,
      u.apellidos as usuario_apellidos,
      u.email as usuario_email,
      (SELECT COUNT(*)::int FROM landing_views v WHERE v.landing_id = l.id) as total_views
    FROM landings l
    LEFT JOIN usuarios u ON l.user_id = u.id
    ORDER BY l.created_at DESC
  `;
}
