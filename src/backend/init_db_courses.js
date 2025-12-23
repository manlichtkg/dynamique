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
        console.log("Starting Course System Database Migration...");

        // CATEGORIES
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) UNIQUE NOT NULL,
                parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: categories");

        // COURSES
        await pool.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                thumbnail_url TEXT,
                teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
                level VARCHAR(50),
                price DECIMAL(10, 2) DEFAULT 0,
                is_published BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: courses");

        // MODULES
        await pool.query(`
            CREATE TABLE IF NOT EXISTS modules (
                id SERIAL PRIMARY KEY,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: modules");

        // LESSONS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS lessons (
                id SERIAL PRIMARY KEY,
                module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('video', 'text', 'quiz')),
                content_url TEXT,
                content_body TEXT,
                order_index INTEGER DEFAULT 0,
                duration_seconds INTEGER DEFAULT 0,
                is_free BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: lessons");

        // Create Full Text Search Index on Courses
        await pool.query(`
            CREATE INDEX IF NOT EXISTS courses_title_search_idx ON courses USING gin(to_tsvector('french', title));
            CREATE INDEX IF NOT EXISTS courses_description_search_idx ON courses USING gin(to_tsvector('french', description));
        `);
        console.log("Created Search Indexes");

        console.log("Course System Migration Completed Successfully.");
    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await pool.end();
    }
};

createTables();
