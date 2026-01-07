-- Create landings and landing_media tables

CREATE TABLE IF NOT EXISTS landings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  title TEXT,
  slug TEXT UNIQUE,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landings_slug ON landings (slug);

CREATE TABLE IF NOT EXISTS landing_media (
  id SERIAL PRIMARY KEY,
  landing_id INTEGER REFERENCES landings(id) ON DELETE CASCADE,
  type TEXT,
  path TEXT,
  url TEXT,
  metadata JSONB DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
