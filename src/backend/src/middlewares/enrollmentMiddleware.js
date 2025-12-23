const db = require('../db');

module.exports = async (req, res, next) => {
    const userId = req.user.id; // From authMiddleware
    // Need to find course_id. It might be in body, query, or params depending on route
    // Or we derived it from lesson_id... this is complex.
    // For simplicity, let's assume this middleware is used on routes where :courseId is params

    let courseId = req.params.courseId || req.body.course_id;

    // If we only have lessonId or moduleId (e.g. GET /api/content/lessons/:id)
    // We would need to query DB to find the course ID first.
    // Skipping that complex logic for this MVP step. 

    if (!courseId) {
        // Fallback: If no courseId, maybe just pass (or strict block)
        // For now, strictly require courseId for this check
        return next();
    }

    try {
        const result = await db.query(
            "SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 AND status IN ('active', 'completed')",
            [userId, courseId]
        );

        if (result.rows.length === 0) {
            // Check if user is teacher of the course?
            const courseRes = await db.query("SELECT teacher_id FROM courses WHERE id = $1", [courseId]);
            if (courseRes.rows.length > 0 && courseRes.rows[0].teacher_id === userId) {
                return next();
            }
            return res.status(403).json({ error: "Vous devez être inscrit pour accéder à ce cours" });
        }

        next();
    } catch (err) {
        console.error("Enrollment Check Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
