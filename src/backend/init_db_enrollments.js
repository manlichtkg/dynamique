const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ecolefacile',
});

const createTables = async () => {
    try {
        console.log("Starting Enrollments & Certificates Migration...");

        // ENROLLMENTS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                progress INTEGER DEFAULT 0,
                last_accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
                UNIQUE(user_id, course_id)
            );
        `);
        console.log("Checked/Created table: enrollments");

        // CERTIFICATES
        // Ensure pgcrypto for UUID if needed, but we can use gen_random_uuid() in PG 13+
        // If older PG, might need 'uuid-ossp' extension. defaulting to simple SERIAL or TEXT if issues arise, but UUID is standard.
        await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS certificates (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                pdf_url TEXT,
                UNIQUE(user_id, course_id)
            );
        `);
        console.log("Checked/Created table: certificates");

        console.log("Enrollments & Certificates Migration Completed Successfully.");
    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await pool.end();
    }
};

createTables();
