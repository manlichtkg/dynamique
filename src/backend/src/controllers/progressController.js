const db = require('../../db');

exports.updateProgress = async (req, res) => {
    const { course_id, lesson_id, status } = req.body;
    const userId = req.user.id;

    if (!['not-started', 'in-progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: "Status invalide" });
    }

    try {
        const completedAt = status === 'completed' ? new Date() : null;

        await db.query(`
            INSERT INTO progress (user_id, course_id, lesson_id, status, completed_at, last_accessed)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (user_id, lesson_id) 
            DO UPDATE SET status = $4, completed_at = COALESCE(progress.completed_at, $5), last_accessed = NOW()
        `, [userId, course_id, lesson_id, status, completedAt]);

        res.json({ success: true, status });
    } catch (err) {
        console.error("Update Progress Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getCourseProgress = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        // Total lessons
        const totalRes = await db.query(
            "SELECT COUNT(*) FROM lessons l JOIN modules m ON l.module_id = m.id WHERE m.course_id = $1",
            [courseId]
        );
        const totalLessons = parseInt(totalRes.rows[0].count);

        // Completed lessons count
        const completedRes = await db.query(
            "SELECT COUNT(*) FROM progress WHERE user_id = $1 AND course_id = $2 AND status = 'completed'",
            [userId, courseId]
        );
        const completedLessons = parseInt(completedRes.rows[0].count);

        // Completed Lesson IDs (for sidebar checks)
        const completedIdsRes = await db.query(
            "SELECT lesson_id FROM progress WHERE user_id = $1 AND course_id = $2 AND status = 'completed'",
            [userId, courseId]
        );
        const completedLessonIds = completedIdsRes.rows.map(row => row.lesson_id);

        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        res.json({
            totalLessons,
            completedLessons,
            completedLessonIds,
            percentage
        });
    } catch (err) {
        console.error("Get Course Progress Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
