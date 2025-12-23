const db = require('../../db');

// Badges Logic
// 1. "Premier Pas": Complete 1 lesson
// 2. "Grand Savant": 3 Quizzes with 100% score
// 3. "Social": 5 Comments Posted

exports.getBadges = async (req, res) => {
    const userId = req.user.id;

    try {
        // defined badges metadata (static for now, logic is dynamic)
        const allBadges = [
            { id: '1', name: 'Premier Pas', description: 'Complétez votre première leçon', icon: '🚀' },
            { id: '2', name: 'Grand Savant', description: 'Obtenez 100% à 3 quiz', icon: '🧠' },
            { id: '3', name: 'Social', description: 'Postez 5 commentaires', icon: '💬' }
        ];

        // 1. Check "Premier Pas"
        const lessonCountRes = await db.query("SELECT COUNT(*) FROM progress WHERE user_id = $1 AND status = 'completed'", [userId]);
        const lessonCount = parseInt(lessonCountRes.rows[0].count);

        // 2. Check "Grand Savant"
        const perfectQuizRes = await db.query("SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND score = 100", [userId]);
        const perfectQuizCount = parseInt(perfectQuizRes.rows[0].count);

        // 3. Check "Social"
        const commentCountRes = await db.query("SELECT COUNT(*) FROM comments WHERE user_id = $1", [userId]);
        const commentCount = parseInt(commentCountRes.rows[0].count);

        // Map status
        const badgesWithStatus = allBadges.map(b => {
            let isUnlocked = false;
            let progress = 0;
            let maxProgress = 1;

            if (b.id === '1') {
                isUnlocked = lessonCount >= 1;
                progress = lessonCount;
                maxProgress = 1;
            } else if (b.id === '2') {
                isUnlocked = perfectQuizCount >= 3;
                progress = perfectQuizCount;
                maxProgress = 3;
            } else if (b.id === '3') {
                isUnlocked = commentCount >= 5;
                progress = commentCount;
                maxProgress = 5;
            }

            return { ...b, isUnlocked, progress, maxProgress };
        });

        res.json(badgesWithStatus);

    } catch (err) {
        console.error("Get Badges Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getChallenges = (req, res) => {
    // Keeping mock for challenges as it involves complex temporal logic (daily/weekly resets)
    // which requires a dedicated table and cron jobs not yet set up.
    // Returning previous mocks for UI stability.
    const mockChallenges = [
        {
            id: 'c1',
            title: 'Quiz Master',
            description: 'Terminez 3 quiz avec un score > 80%',
            rewardPoints: 500,
            currentProgress: 1, // Placeholder
            maxProgress: 3,
            timeLeft: '4h 12m',
            type: 'daily',
        },
        {
            id: 'c2',
            title: 'Explorateur de Sciences',
            description: 'Complétez le module "Physique Quantique"',
            rewardPoints: 1200,
            currentProgress: 45,
            maxProgress: 100,
            timeLeft: '3j 10h',
            type: 'weekly',
        },
    ];
    res.json(mockChallenges);
};

exports.getActivity = async (req, res) => {
    const userId = req.user.id;
    try {
        // Fetch recent activity from analytics/progress/quiz_attempts
        // For simple MVP: Union of recent completed lessons and quiz attempts
        // Note: Union queries can be complex, simplifying to just recent lessons for now.

        const result = await db.query(`
            SELECT 
                p.completed_at as timestamp,
                'a terminé la leçon' as action,
                l.title as target,
                u.full_name as user_name,
                u.avatar_url as user_avatar
            FROM progress p
            JOIN lessons l ON p.lesson_id = l.id
            JOIN users u ON p.user_id = u.id
            WHERE p.status = 'completed'
            ORDER BY p.completed_at DESC
            LIMIT 10
        `);

        // Map to frontend format
        const activity = result.rows.map((row, index) => ({
            id: `act-${index}`,
            userId: 'u', // Anonymous in feed or join correct user
            userName: row.user_name || 'Utilisateur',
            userAvatar: row.user_avatar,
            action: row.action,
            target: row.target,
            timestamp: new Date(row.timestamp).toLocaleDateString() // formatting needed
        }));

        res.json(activity);
    } catch (err) {
        console.error("Get Activity Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
