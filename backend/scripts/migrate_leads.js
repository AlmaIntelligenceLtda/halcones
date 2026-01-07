import { sql } from '../db/connection.js';

async function migrate() {
    try {
        console.log('🚀 Running 005_create_leads.sql ...');
        
        await sql`
            CREATE TABLE IF NOT EXISTS landing_leads (
              id SERIAL PRIMARY KEY,
              landing_id INTEGER REFERENCES landings(id) ON DELETE CASCADE,
              type TEXT,
              data JSONB DEFAULT '{}',
              created_at TIMESTAMPTZ DEFAULT NOW(),
              read_status BOOLEAN DEFAULT FALSE
            );
        `;
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_landing_leads_landing_id ON landing_leads(landing_id);
        `;
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_landing_leads_created_at ON landing_leads(created_at);
        `;

        console.log('✅ Migration 005 completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
