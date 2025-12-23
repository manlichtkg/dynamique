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
        console.log("Starting Analytics Migration...");

        // ANALYTICS EVENTS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS analytics_events (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                event_type VARCHAR(50) NOT NULL,
                resource_id INTEGER,
                resource_type VARCHAR(50),
                meta_data JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: analytics_events");

        console.log("Analytics Migration Completed Successfully.");
    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await pool.end();
    }
};

createTables();
