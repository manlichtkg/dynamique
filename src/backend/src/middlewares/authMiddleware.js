const db = require('../../db');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Token manquant" });

    try {
        const result = await db.query(
            "SELECT users.* FROM auth_sessions JOIN users ON auth_sessions.user_id = users.id WHERE token = $1",
            [token]
        );
        const user = result.rows[0];

        if (!user) return res.status(403).json({ error: "Session expirée" });
        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        res.sendStatus(500);
    }
};
