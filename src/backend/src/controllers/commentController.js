const db = require('../../db');

// Post a comment or reply
exports.postComment = async (req, res) => {
    const { lesson_id, parent_id, content } = req.body;
    const userId = req.user.id;

    if (!lesson_id || !content) return res.status(400).json({ error: "Lesson ID et contenu requis" });

    try {
        const result = await db.query(
            "INSERT INTO comments (user_id, lesson_id, parent_id, content) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, lesson_id, parent_id || null, content]
        );
        res.status(201).json(result.rows[0]);
        // TODO: Trigger notification for parent author if reply
    } catch (err) {
        console.error("Post Comment Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Get comments for a lesson (Hierarchical or Flat)
exports.getCommentsByLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
        // Fetch all comments for the lesson
        const result = await db.query(`
            SELECT c.*, u.full_name as user_name, u.avatar_url as user_avatar 
            FROM comments c 
            JOIN users u ON c.user_id = u.id 
            WHERE c.lesson_id = $1 
            ORDER BY c.created_at ASC`,
            [lessonId]
        );

        const comments = result.rows;

        // Build hierarchy in-memory for simplicity
        const map = {};
        const roots = [];

        comments.forEach(c => {
            c.replies = [];
            map[c.id] = c;
        });

        comments.forEach(c => {
            if (c.parent_id && map[c.parent_id]) {
                map[c.parent_id].replies.push(c);
            } else {
                roots.push(c);
            }
        });

        res.json(roots);
    } catch (err) {
        console.error("Get Comments Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.deleteComment = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Check ownership or admin
        const check = await db.query("SELECT user_id FROM comments WHERE id = $1", [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: "Commentaire non trouvé" });

        if (check.rows[0].user_id !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Non autorisé" });
        }

        await db.query("DELETE FROM comments WHERE id = $1", [id]);
        res.sendStatus(204);
    } catch (err) {
        console.error("Delete Comment Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
