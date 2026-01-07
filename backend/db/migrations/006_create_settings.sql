-- 006_create_settings.sql
CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  type VARCHAR(50) DEFAULT 'string', -- string, boolean, number, color
  category VARCHAR(50) DEFAULT 'general',
  label VARCHAR(200),
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial settings if table is empty
INSERT INTO settings (key, value, type, category, label, description)
VALUES 
  ('site_name', 'Halcones', 'string', 'general', 'Nombre del Sitio', 'Nombre mostrado en el título y encabezados.'),
  ('support_email', 'contacto@halcones.cl', 'string', 'general', 'Email de Soporte', 'Correo para contacto y pie de página.'),
  ('maintenance_mode', 'false', 'boolean', 'system', 'Modo Mantenimiento', 'Si está activo, solo los superusuarios pueden ingresar.'),
  ('allow_registration', 'true', 'boolean', 'system', 'Permitir Registro', 'Habilita o deshabilita el registro de nuevos usuarios públicos.'),
  ('primary_color', '#FFC300', 'color', 'appearance', 'Color Principal', 'Color de énfasis utilizado en la interfaz (botones, logos).')
ON CONFLICT (key) DO NOTHING;
