import { sql } from '../db/connection.js';

async function migrate() {
    try {
        console.log('🚀 Running 004_create_analytics.sql ...');
        
        // Split commands because neon driver might prefer single statements per tag
        
        await sql`
            CREATE TABLE IF NOT EXISTS landing_views (
              id SERIAL PRIMARY KEY,
              landing_id INTEGER REFERENCES landings(id) ON DELETE CASCADE,
              ip_hash TEXT,
              user_agent TEXT,
              referer TEXT,
              created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_landing_views_landing_id ON landing_views(landing_id);
        `;
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_landing_views_created_at ON landing_views(created_at);
        `;

        console.log('✅ Migration 004 completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
