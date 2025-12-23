const db = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../img/avatars');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Format de fichier non supporté (Images seulement)'));
    }
});

exports.uploadAvatarMiddleware = upload.single('avatar');

exports.getMe = (req, res) => {
    // Return sanitized user object
    const { password_hash, ...userSafe } = req.user;
    res.json(userSafe);
};

exports.updateProfile = async (req, res) => {
    const { full_name } = req.body;
    let avatar_url = req.body.avatar_url; // If passing URL directly

    // If file uploaded via Multer
    if (req.file) {
        avatar_url = `/img/avatars/${req.file.filename}`;
    }

    try {
        const result = await db.query(
            "UPDATE users SET full_name = COALESCE($1, full_name), avatar_url = COALESCE($2, avatar_url), updated_at = NOW() WHERE id = $3 RETURNING id, email, full_name, avatar_url, role",
            [full_name, avatar_url, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const result = await db.query("SELECT id, full_name, avatar_url, total_points, title FROM users WHERE is_active = true ORDER BY total_points DESC LIMIT 10");
        const leaderboard = result.rows.map((row, index) => ({
            ...row,
            name: row.full_name, // Map for frontend compatibility if needed
            avatar: row.avatar_url,
            rank: index + 1
        }));
        res.json(leaderboard);
    } catch (err) {
        console.error("Leaderboard Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Start Password Reset Flow (Forgot Password)
exports.forgotPassword = async (req, res) => {
    // TODO: Implement Logic (This is usually in Auth, but can be here too)
};
