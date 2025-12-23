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
        console.log("Starting Advanced Content & Progression Migration...");

        // RESOURCES
        await pool.query(`
            CREATE TABLE IF NOT EXISTS resources (
                id SERIAL PRIMARY KEY,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL,
                url TEXT NOT NULL,
                title VARCHAR(255),
                size INTEGER,
                duration INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: resources");

        // QUIZZES
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quizzes (
                id SERIAL PRIMARY KEY,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
                title VARCHAR(255),
                passing_score INTEGER DEFAULT 70,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: quizzes");

        // QUESTIONS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quiz_questions (
                id SERIAL PRIMARY KEY,
                quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
                question_text TEXT NOT NULL,
                question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'true_false', 'text')),
                points INTEGER DEFAULT 1,
                order_index INTEGER DEFAULT 0
            );
        `);
        console.log("Checked/Created table: quiz_questions");

        // OPTIONS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quiz_options (
                id SERIAL PRIMARY KEY,
                question_id INTEGER REFERENCES quiz_questions(id) ON DELETE CASCADE,
                option_text TEXT NOT NULL,
                is_correct BOOLEAN DEFAULT false
            );
        `);
        console.log("Checked/Created table: quiz_options");

        // ATTEMPTS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quiz_attempts (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
                score INTEGER,
                passed BOOLEAN,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: quiz_attempts");

        // PROGRESS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS progress (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
                lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
                status VARCHAR(50) CHECK (status IN ('not-started', 'in-progress', 'completed')),
                completed_at TIMESTAMP,
                last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, lesson_id)
            );
        `);
        console.log("Checked/Created table: progress");

        console.log("Advanced Content Migration Completed Successfully.");
    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await pool.end();
    }
};

createTables();
