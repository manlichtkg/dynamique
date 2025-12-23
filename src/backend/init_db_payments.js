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
        console.log("Starting Payment System Migration...");

        // PAYMENT METHODS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payment_methods (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                provider VARCHAR(50) NOT NULL,
                provider_payment_method_id VARCHAR(255) NOT NULL,
                type VARCHAR(50),
                last4 VARCHAR(4),
                brand VARCHAR(50),
                is_default BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: payment_methods");

        // SUBSCRIPTIONS
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                plan_id VARCHAR(100) NOT NULL,
                provider_subscription_id VARCHAR(255) UNIQUE,
                status VARCHAR(50) CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
                current_period_start TIMESTAMP,
                current_period_end TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: subscriptions");

        // PAYMENTS (Transactions)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
                amount DECIMAL(10, 2) NOT NULL,
                currency VARCHAR(3) DEFAULT 'EUR',
                provider VARCHAR(50) NOT NULL,
                provider_payment_id VARCHAR(255) UNIQUE NOT NULL,
                status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Checked/Created table: payments");

        console.log("Payment Migration Completed Successfully.");
    } catch (err) {
        console.error("Migration Failed:", err);
    } finally {
        await pool.end();
    }
};

createTables();
