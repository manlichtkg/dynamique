const db = require('../../db');

exports.getNotifications = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query(
            "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get Notifications Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.markAsRead = async (req, res) => {
    const { id } = req.params; // Notification ID
    const userId = req.user.id;
    try {
        await db.query("UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2", [id, userId]);
        res.sendStatus(200);
    } catch (err) {
        console.error("Mark Notification Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.markAllAsRead = async (req, res) => {
    const userId = req.user.id;
    try {
        await db.query("UPDATE notifications SET is_read = true WHERE user_id = $1", [userId]);
        res.sendStatus(200);
    } catch (err) {
        console.error("Mark All Notifications Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
