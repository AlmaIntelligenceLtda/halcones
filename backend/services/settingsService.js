import { sql } from "../db/connection.js";

// Obtener todas las configuraciones
export async function obtenerConfiguraciones() {
  return await sql`
    SELECT key, value, type, category, label, description 
    FROM settings 
    ORDER BY category, key
  `;
}

// Obtener una configuración específica (helper interno)
export async function obtenerConfig(key) {
  const [row] = await sql`
    SELECT value FROM settings WHERE key = ${key}
  `;
  return row ? row.value : null;
}

// Actualizar configuraciones (recibe un objeto { key: value })
export async function actualizarConfiguraciones(settingsObj) {
  const results = [];
  
  // Procesar una por una (o hacer un upsert masivo, pero loop es seguro para pocos datos)
  for (const [key, value] of Object.entries(settingsObj)) {
    const [updated] = await sql`
      UPDATE settings 
      SET value = ${String(value)}, updated_at = NOW() 
      WHERE key = ${key}
      RETURNING key, value
    `;
    if (updated) results.push(updated);
  }
  
  return results;
}

// Insert/Update single config key (allows introducing new keys without a migration)
export async function upsertConfig({
  key,
  value,
  type = 'string',
  category = 'general',
  label = null,
  description = null
}) {
  if (!key) throw new Error('KEY_REQUIRED');

  const normalizedValue = value === null || typeof value === 'undefined' ? null : String(value);

  const [row] = await sql`
    INSERT INTO settings (key, value, type, category, label, description, updated_at)
    VALUES (${key}, ${normalizedValue}, ${type}, ${category}, ${label}, ${description}, NOW())
    ON CONFLICT (key) DO UPDATE SET
      value = EXCLUDED.value,
      type = COALESCE(EXCLUDED.type, settings.type),
      category = COALESCE(EXCLUDED.category, settings.category),
      label = COALESCE(EXCLUDED.label, settings.label),
      description = COALESCE(EXCLUDED.description, settings.description),
      updated_at = NOW()
    RETURNING key, value
  `;
  return row;
}
