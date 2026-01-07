import fs from 'fs';
import path from 'path';
import { sql } from '../db/connection.js';

const MIGRATION_FILE = path.join(process.cwd(), 'backend', 'db', 'migrations', '003_professional_schema.sql');

async function runMigration() {
  try {
    console.log('🚀 Starting database migration...');
    
    if (!fs.existsSync(MIGRATION_FILE)) {
      throw new Error(`Migration file not found at: ${MIGRATION_FILE}`);
    }

    const sqlContent = fs.readFileSync(MIGRATION_FILE, 'utf-8');
    
    // Split by semicolon to run statements individually if needed, 
    // but `postgres` driver usually handles multiple statements if passed as a single string.
    // However, the `sql` tag from neon/postgres might expect a template literal.
    // For safety with the `sql` tag, we usually pass the string directly if the driver supports it,
    // or we use a raw query method if available. 
    // Since `sql` tag is for parameterized queries, passing a raw string might be tricky if it contains variables.
    // But this is a schema file, so it should be fine to pass as a simple query.
    
    // NOTE: The `sql` tag in many libraries (like postgres.js) allows executing a file or raw string.
    // Let's assume `sql` is a function that can take a string or we use `sql.file` if available.
    // If it's the `postgres` library (which is common with Neon), `sql.file(path)` is the way.
    // If it's just a tagged template, we might need to be careful.
    
    // The neon driver accepts a string directly for execution
    await sql(sqlContent); 

    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
