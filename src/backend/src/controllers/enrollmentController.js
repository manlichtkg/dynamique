const db = require('../../db');

exports.enrollUser = async (req, res) => {
    const { course_id } = req.body;
    const userId = req.user.id;

    if (!course_id) return res.status(400).json({ error: "ID du cours requis" });

    try {
        // Check if course exists
        const courseRes = await db.query("SELECT * FROM courses WHERE id = $1", [course_id]);
        if (courseRes.rows.length === 0) return res.status(404).json({ error: "Cours non trouvé" });

        // Check already enrolled
        const check = await db.query("SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2", [userId, course_id]);
        if (check.rows.length > 0) return res.status(409).json({ error: "Déjà inscrit" });

        // Create enrollment
        const result = await db.query(
            "INSERT INTO enrollments (user_id, course_id, status) VALUES ($1, $2, 'active') RETURNING *",
            [userId, course_id]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Enrollment Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getUserEnrollments = async (req, res) => {
    const userId = req.user.id;
    try {
        // Fetch enrollments with:
        // 1. Course details
        // 2. Total lessons count (Subquery)
        // 3. Completed lessons count (Subquery via progress table - dependent on strictness, 
        //    or use the 'progress' % column in enrollments table if managed via trigger/update)

        // Assuming 'progress' column in enrollments is updated via progressController.
        // We just need total_lessons to be accurate for display if frontend calculates it,
        // OR better: return calculated progress based on actual counts ensuring sync.

        // Let's rely on the Enrollment Table's 'progress' field for % (0-100) 
        // AND return total_lessons for metadata.

        const result = await db.query(`
            SELECT 
                e.*, 
                c.title, 
                c.thumbnail_url,
                (
                    SELECT COUNT(*) 
                    FROM lessons l 
                    JOIN modules m ON l.module_id = m.id 
                    WHERE m.course_id = c.id
                ) as total_lessons
            FROM enrollments e 
            JOIN courses c ON e.course_id = c.id 
            WHERE e.user_id = $1`,
            [userId]
        );

        // Ensure total_lessons is integer
        const data = result.rows.map(row => ({
            ...row,
            total_lessons: parseInt(row.total_lessons || 0)
        }));

        res.json(data);
    } catch (err) {
        console.error("Get Enrollments Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.checkEnrollmentStatus = async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;
    try {
        const result = await db.query(
            "SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2",
            [userId, courseId]
        );
        res.json({ isEnrolled: result.rows.length > 0, details: result.rows[0] });
    } catch (err) {
        console.error("Check Enrollment Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
