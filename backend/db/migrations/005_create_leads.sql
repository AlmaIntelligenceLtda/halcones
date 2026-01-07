-- 005_create_leads.sql
CREATE TABLE IF NOT EXISTS landing_leads (
  id SERIAL PRIMARY KEY,
  landing_id INTEGER REFERENCES landings(id) ON DELETE CASCADE,
  type TEXT, -- 'form' or 'pricing'
  data JSONB DEFAULT '{}', -- { fields: [...], plan: '...', etc }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_status BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_landing_leads_landing_id ON landing_leads(landing_id);
CREATE INDEX IF NOT EXISTS idx_landing_leads_created_at ON landing_leads(created_at);
