-- 004_create_analytics.sql
CREATE TABLE IF NOT EXISTS landing_views (
  id SERIAL PRIMARY KEY,
  landing_id INTEGER REFERENCES landings(id) ON DELETE CASCADE,
  ip_hash TEXT,
  user_agent TEXT,
  referer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_landing_views_landing_id ON landing_views(landing_id);
CREATE INDEX IF NOT EXISTS idx_landing_views_created_at ON landing_views(created_at);
