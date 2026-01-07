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
