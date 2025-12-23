const db = require('../../db');

exports.getAllCategories = async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM categories ORDER BY name ASC");
        res.json(result.rows);
    } catch (err) {
        console.error("Get Categories Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.createCategory = async (req, res) => {
    // Admin only check ideally, keeping simple for now
    const { name, slug, parent_id } = req.body;
    if (!name || !slug) return res.status(400).json({ error: "Nom et Slug requis" });

    try {
        const result = await db.query(
            "INSERT INTO categories (name, slug, parent_id) VALUES ($1, $2, $3) RETURNING *",
            [name, slug, parent_id || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create Category Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, slug, parent_id } = req.body;

    try {
        const result = await db.query(
            "UPDATE categories SET name = COALESCE($1, name), slug = COALESCE($2, slug), parent_id = COALESCE($3, parent_id) WHERE id = $4 RETURNING *",
            [name, slug, parent_id, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: "Catégorie non trouvée" });
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Update Category Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM categories WHERE id = $1", [id]);
        res.sendStatus(204);
    } catch (err) {
        console.error("Delete Category Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
