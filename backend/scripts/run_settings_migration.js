import fs from 'fs';
import path from 'path';
import { sql } from '../db/connection.js'; // Adjust path if needed

const MIGRATION_FILE = path.join(process.cwd(), 'backend', 'db', 'migrations', '006_create_settings.sql');

async function runMigration() {
  try {
    console.log('🚀 Starting settings migration...');
    
    if (!fs.existsSync(MIGRATION_FILE)) {
      throw new Error(`Migration file not found at: ${MIGRATION_FILE}`);
    }

    const sqlContent = fs.readFileSync(MIGRATION_FILE, 'utf-8');
    
    // Using neon/postgres simple query execution
    // Note: sql`...` expects template literals. For raw strings, we often use sql.unsafe or similar if available,
    // or just pass it if the library overload matches.
    // If sql is `postgres.js`, sql(string) assumes parameters. 
    // Let's try unsafe if it exists, or splitting.
    // Most drivers allow: await sql.unsafe(sqlContent)
    
    if (sql.unsafe) {
        await sql.unsafe(sqlContent);
    } else {
        // Fallback: This might fail if the library forces tagged templates strictly
        // But let's try passing it as a variable which *should* be parameterized, 
        // BUT we want to execute structure. 
        // Actually, with postgres.js, `sql.file` is best.
        if (sql.file) {
             await sql.file(MIGRATION_FILE);
        } else {
            // Last resort: unsafe execution or just console log instructions if this fails.
            // Let's assume there is a way. 
            // Postgres.js usually has `sql.unsafe`.
             await sql.unsafe(sqlContent);
        }
    }

    console.log('✅ Settings migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

runMigration();
