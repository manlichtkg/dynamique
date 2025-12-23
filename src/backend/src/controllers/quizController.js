const db = require('../../db');

// --- QUIZ MANAGEMENT ---

exports.createQuiz = async (req, res) => {
    const { lesson_id, title, passing_score } = req.body;
    try {
        const result = await db.query(
            "INSERT INTO quizzes (lesson_id, title, passing_score) VALUES ($1, $2, $3) RETURNING *",
            [lesson_id, title, passing_score || 70]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create Quiz Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.addQuestion = async (req, res) => {
    const { quiz_id, question_text, question_type, points, order_index, options } = req.body;
    try {
        // 1. Create Question
        const qRes = await db.query(
            "INSERT INTO quiz_questions (quiz_id, question_text, question_type, points, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [quiz_id, question_text, question_type, points || 1, order_index || 0]
        );
        const question = qRes.rows[0];

        // 2. Create Options
        if (options && Array.isArray(options)) {
            for (const opt of options) {
                await db.query(
                    "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)",
                    [question.id, opt.text, opt.is_correct]
                );
            }
        }
        res.status(201).json(question);
    } catch (err) {
        console.error("Add Question Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getQuizByLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const qRes = await db.query("SELECT * FROM quizzes WHERE lesson_id = $1", [lessonId]);
        if (qRes.rows.length === 0) return res.status(404).json({ error: "Quiz non trouvé" });
        const quiz = qRes.rows[0];

        const questionsRes = await db.query("SELECT * FROM quiz_questions WHERE quiz_id = $1 ORDER BY order_index ASC", [quiz.id]);
        const questions = questionsRes.rows;

        // Fetch options for each question
        for (const q of questions) {
            const optRes = await db.query("SELECT id, option_text FROM quiz_options WHERE question_id = $1", [q.id]);
            q.options = optRes.rows;
        }

        res.json({ ...quiz, questions });
    } catch (err) {
        console.error("Get Quiz Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// --- QUIZ ATTEMPTS ---

exports.submitAttempt = async (req, res) => {
    const { quiz_id, answers } = req.body; // answers: { question_id: option_id }
    const userId = req.user.id;

    try {
        // Fetch full quiz with correct answers
        const questionsRes = await db.query("SELECT * FROM quiz_questions WHERE quiz_id = $1", [quiz_id]);
        const questions = questionsRes.rows;

        let totalScore = 0;
        let maxScore = 0;

        for (const q of questions) {
            maxScore += q.points;
            const userAnswerId = answers[q.id];

            if (userAnswerId) {
                const optRes = await db.query("SELECT is_correct FROM quiz_options WHERE id = $1 AND question_id = $2", [userAnswerId, q.id]);
                if (optRes.rows.length > 0 && optRes.rows[0].is_correct) {
                    totalScore += q.points;
                }
            }
        }

        const quizRes = await db.query("SELECT passing_score FROM quizzes WHERE id = $1", [quiz_id]);
        const passingScore = quizRes.rows[0].passing_score;
        const percentage = (totalScore / maxScore) * 100;
        const passed = percentage >= passingScore;

        const attemptRes = await db.query(
            "INSERT INTO quiz_attempts (user_id, quiz_id, score, passed) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, quiz_id, totalScore, passed]
        );

        res.json({
            attempt: attemptRes.rows[0],
            maxScore,
            percentage,
            passed
        });

    } catch (err) {
        console.error("Submit Attempt Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
