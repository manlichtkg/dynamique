const db = require('../../db');

// List Conversations
exports.getConversations = async (req, res) => {
    const userId = req.user.id;
    try {
        // Complex query to get conversations with last message and other participant
        // Simplifying for MVP: Get conversation IDs user is in
        const result = await db.query(`
            SELECT c.id, c.updated_at,
            (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
            FROM conversations c
            JOIN conversation_participants cp ON c.id = cp.conversation_id
            WHERE cp.user_id = $1
            ORDER BY c.updated_at DESC
        `, [userId]);

        // Better implementation would join to get the "other" user details
        res.json(result.rows);
    } catch (err) {
        console.error("Get Conversations Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Get Messages in Conversation
exports.getMessages = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Check participation
    try {
        const check = await db.query("SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2", [conversationId, userId]);
        if (check.rows.length === 0) return res.status(403).json({ error: "Non participant" });

        const result = await db.query(`
            SELECT m.*, u.full_name as sender_name 
            FROM messages m 
            JOIN users u ON m.sender_id = u.id 
            WHERE conversion_id = $1 
            ORDER BY created_at ASC`,
            [conversationId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get Messages Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Start Conversation (Create or Get existing)
exports.startConversation = async (req, res) => {
    const { recipient_id } = req.body;
    const userId = req.user.id;

    if (recipient_id === userId) return res.status(400).json({ error: "Impossible de discuter avec soi-même" });

    try {
        // Check if exists (simplified: just creating new for now or naive check)
        const result = await db.query("INSERT INTO conversations DEFAULT VALUES RETURNING id");
        const convId = result.rows[0].id;

        await db.query("INSERT INTO conversation_participants (conversation_id, user_id) VALUES ($1, $2), ($1, $3)", [convId, userId, recipient_id]);

        res.status(201).json({ id: convId });
    } catch (err) {
        console.error("Start Conversation Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

// Send Message
exports.sendMessage = async (req, res) => {
    const { conversation_id, content } = req.body;
    const userId = req.user.id;

    if (!conversation_id || !content) return res.status(400).json({ error: "Conversation ID et contenu requis" });

    try {
        // Verify participation
        const check = await db.query("SELECT * FROM conversation_participants WHERE conversation_id = $1 AND user_id = $2", [conversation_id, userId]);
        if (check.rows.length === 0) return res.status(403).json({ error: "Non participant" });

        const result = await db.query(
            "INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *",
            [conversation_id, userId, content]
        );

        // Update conversation timestamp
        await db.query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [conversation_id]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Send Message Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
