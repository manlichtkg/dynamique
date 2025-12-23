const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../db');

// Secure secrets (should be in .env)
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_secure_123';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_secure_123';

const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' } // Strict 15m expiration
    );
    const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' } // 7 days expiration
    );
    return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
    const { email, password, full_name } = req.body;
    if (!email || !password || !full_name) return res.status(400).json({ error: "Champs manquants" });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: "Format email invalide" });

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${full_name}`;

        const result = await db.query(
            "INSERT INTO users (email, password_hash, full_name, role, avatar_url, is_active, email_verified) VALUES ($1, $2, $3, 'user', $4, true, false) RETURNING id, email, full_name, role, avatar_url, created_at",
            [email, passwordHash, full_name, avatar]
        );

        const user = result.rows[0];
        const { accessToken, refreshToken } = generateTokens(user);

        // Store refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", [user.id, refreshToken, expiresAt]);

        res.status(201).json({ accessToken, refreshToken, user });
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ error: "Cet email est déjà utilisé" });
        console.error("Register Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: "Email ou mot de passe incorrect" });
        if (!user.is_active) return res.status(403).json({ error: "Compte désactivé" });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ error: "Email ou mot de passe incorrect" });

        const { accessToken, refreshToken } = generateTokens(user);

        // Store refresh token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await db.query("INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)", [user.id, refreshToken, expiresAt]);

        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                avatar_url: user.avatar_url,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.sendStatus(401);

    try {
        const dbRes = await db.query("SELECT * FROM refresh_tokens WHERE token = $1", [refreshToken]);
        if (dbRes.rows.length === 0) return res.sendStatus(403);

        const storedToken = dbRes.rows[0];
        if (new Date() > new Date(storedToken.expires_at)) {
            await db.query("DELETE FROM refresh_tokens WHERE id = $1", [storedToken.id]);
            return res.status(403).json({ error: "Token expiré" });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) return res.sendStatus(403);

            const userRes = await db.query("SELECT id, role FROM users WHERE id = $1", [decoded.id]);
            if (userRes.rows.length === 0) return res.sendStatus(403);

            const user = userRes.rows[0];

            // Generate NEW access token
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );

            // Optional: Rotate refresh token here for extra security

            res.json({ accessToken });
        });
    } catch (err) {
        console.error("Refresh Error:", err);
        res.sendStatus(500);
    }
};

exports.logout = async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
        await db.query("DELETE FROM refresh_tokens WHERE token = $1", [refreshToken]);
    }
    res.sendStatus(204);
};

exports.forgotPassword = async (req, res) => {
    // TODO: Implement with password_reset_tokens and Nodemailer
    res.status(501).json({ error: "Non implémenté" });
};

