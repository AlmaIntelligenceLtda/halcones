-- 003_professional_schema.sql
-- Consolidated schema for professional landing page software

-- 1. Usuarios (Users)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  rut TEXT UNIQUE,
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'cliente' CHECK (rol IN ('superusuario', 'cliente', 'editor')),
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rut ON usuarios(rut);

-- 2. Clientes (Clients)
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  rut TEXT UNIQUE,
  nombre TEXT NOT NULL,
  direccion TEXT,
  ciudad TEXT,
  comuna TEXT,
  telefono TEXT,
  email TEXT,
  foto TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Landings
CREATE TABLE IF NOT EXISTS landings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  data JSONB DEFAULT '{}', -- Stores builder content/config
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landings_slug ON landings(slug);
CREATE INDEX IF NOT EXISTS idx_landings_user ON landings(user_id);

-- 4. Landing Media (Images/Videos attached to landings)
CREATE TABLE IF NOT EXISTS landing_media (
  id SERIAL PRIMARY KEY,
  landing_id INTEGER REFERENCES landings(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'image', 'video'
  path TEXT NOT NULL, -- File system path
  url TEXT NOT NULL, -- Public URL
  metadata JSONB DEFAULT '{}', -- Size, dimensions, etc.
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_media_landing ON landing_media(landing_id);

-- 5. Audit Logs (Professional tracking)
CREATE TABLE IF NOT EXISTS audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'LOGIN', 'CREATE_LANDING', 'UPDATE_CLIENT'
  entity TEXT, -- e.g., 'landing', 'cliente'
  entity_id INTEGER,
  details JSONB DEFAULT '{}',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- 6. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_landings_updated_at ON landings;
CREATE TRIGGER update_landings_updated_at
    BEFORE UPDATE ON landings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
