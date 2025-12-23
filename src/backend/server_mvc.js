require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const db = require('./db');

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');
const resourceRoutes = require('./src/routes/resourceRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
const certificateRoutes = require('./src/routes/certificateRoutes');
const commentRoutes = require('./src/routes/commentRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const gamificationRoutes = require('./src/routes/gamificationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(bodyParser.json());

// Global Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Initialize DB Strategy (Postgres)
const initDB = async () => {
    try {
        await db.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            name TEXT,
            avatar TEXT,
            title TEXT DEFAULT 'Apprenti',
            total_points INTEGER DEFAULT 0,
            day_streak INTEGER DEFAULT 0,
            role TEXT DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS refresh_tokens (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            token TEXT UNIQUE NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            title TEXT,
            author TEXT,
            lessons_count INTEGER,
            duration TEXT,
            category TEXT,
            image TEXT,
            rating REAL DEFAULT 4.8
        )`);

        await db.query(`CREATE TABLE IF NOT EXISTS user_progress (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            course_id INTEGER REFERENCES courses(id),
            completed_lessons INTEGER DEFAULT 0,
            is_completed BOOLEAN DEFAULT FALSE,
            last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed Courses
        const countRes = await db.query("SELECT count(*) FROM courses");
        if (parseInt(countRes.rows[0].count) === 0) {
            console.log("🌱 Seeding Courses...");
            await db.query("INSERT INTO courses (title, author, lessons_count, duration, category, image) VALUES ($1, $2, $3, $4, $5, $6)",
                ["Introduction à l'IA", "Dr. Alan", 12, "4h 30m", "Technologie", "https://images.unsplash.com/photo-1677442136019-21780ecad995"]);
            await db.query("INSERT INTO courses (title, author, lessons_count, duration, category, image) VALUES ($1, $2, $3, $4, $5, $6)",
                ["Design Avancé", "Sarah Lynch", 8, "2h 15m", "Design", "https://images.unsplash.com/photo-1561070791-2526d30994b5"]);
        }

        console.log("✅ PostgreSQL Tables Ready");
    } catch (err) {
        console.error("❌ DB Init Error:", err);
    }
};

initDB();

// Serve Static Frontend (Production)
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/content', moduleRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);

// Legacy redirect
app.use('/api/leaderboard', (req, res) => res.redirect('/api/users/leaderboard'));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Anything that doesn't match the API routes, send back the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server MVC running on http://localhost:${PORT}`);
});
