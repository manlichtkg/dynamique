const db = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for Thumbnails
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../img/thumbnails');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'thumb-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Images seulement (jpg, png, webp)'));
    }
});

exports.uploadThumbnailMiddleware = upload.single('thumbnail');

// Helper to build queries
const buildCourseQuery = (params) => {
    let text = "SELECT c.*, u.full_name as teacher_name, cat.name as category_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id LEFT JOIN categories cat ON c.category_id = cat.id WHERE 1=1";
    const values = [];
    let count = 1;

    if (params.search) {
        text += ` AND (LOWER(c.title) LIKE $${count} OR LOWER(c.description) LIKE $${count})`;
        values.push(`%${params.search.toLowerCase()}%`);
        count++;
    }

    if (params.category_id) {
        text += ` AND c.category_id = $${count}`;
        values.push(params.category_id);
        count++;
    }

    if (params.level) {
        text += ` AND c.level = $${count}`;
        values.push(params.level);
        count++;
    }

    if (params.min_price) {
        text += ` AND c.price >= $${count}`;
        values.push(params.min_price);
        count++;
    }

    if (params.max_price) {
        text += ` AND c.price <= $${count}`;
        values.push(params.max_price);
        count++;
    }

    // Only published courses for public (unless admin/teacher override - simplified here)
    // text += ` AND is_published = true`; 

    text += ` ORDER BY c.created_at DESC`; // Default sort

    // Pagination
    const limit = params.limit || 20;
    const offset = params.offset || 0;
    text += ` LIMIT $${count} OFFSET $${count + 1}`;
    values.push(limit, offset);

    return { text, values };
};

exports.getAllCourses = async (req, res) => {
    try {
        const query = buildCourseQuery(req.query);
        const result = await db.query(query.text, query.values);
        res.json(result.rows);
    } catch (err) {
        console.error("Get Courses Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getCourseById = async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch Course details
        const courseRes = await db.query(
            "SELECT c.*, u.full_name as teacher_name FROM courses c LEFT JOIN users u ON c.teacher_id = u.id WHERE c.id = $1",
            [id]
        );
        if (courseRes.rows.length === 0) return res.status(404).json({ error: "Cours non trouvé" });
        const course = courseRes.rows[0];

        // Fetch Modules & Lessons
        const modulesRes = await db.query("SELECT * FROM modules WHERE course_id = $1 ORDER BY order_index ASC", [id]);
        const modules = modulesRes.rows;

        // Fetch all lessons for these modules
        // Optimization: fetch all lessons for course_id via join or separate queries
        // Simple approach: Iterate (N+1 prob but okay for small course size) or get all
        const moduleIds = modules.map(m => m.id);
        let lessons = [];
        if (moduleIds.length > 0) {
            const lessonsRes = await db.query(
                "SELECT * FROM lessons WHERE module_id = ANY($1::int[]) ORDER BY order_index ASC",
                [moduleIds]
            );
            lessons = lessonsRes.rows;
        }

        // Nest lessons into modules
        const structuredModules = modules.map(m => ({
            ...m,
            lessons: lessons.filter(l => l.module_id === m.id)
        }));

        res.json({ ...course, modules: structuredModules });
    } catch (err) {
        console.error("Get Course Detail Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.createCourse = async (req, res) => {
    const { title, description, category_id, level, price } = req.body;
    let thumbnail_url = null;

    if (req.file) {
        thumbnail_url = `/img/thumbnails/${req.file.filename}`;
    }

    try {
        const result = await db.query(
            "INSERT INTO courses (title, description, thumbnail_url, teacher_id, category_id, level, price, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *",
            [title, description, thumbnail_url, req.user.id, category_id || null, level || 'beginner', price || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create Course Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.updateCourse = async (req, res) => {
    // Similar to Create but with UPDATE + Ownership check
    // Assuming Ownership Middleware or check here
    // Skipping for brevity in this step, focusing on Read/Create
    res.status(501).json({ error: "Not implemented yet" });
};

exports.deleteCourse = async (req, res) => {
    // Delete cascade will handle modules/lessons
    const { id } = req.params;
    try {
        // Ownership check
        const check = await db.query("SELECT teacher_id FROM courses WHERE id = $1", [id]);
        if (check.rows.length === 0) return res.status(404).json({ error: "Cours non trouvé" });
        if (check.rows[0].teacher_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Non autorisé" });
        }

        await db.query("DELETE FROM courses WHERE id = $1", [id]);
        res.sendStatus(204);
    } catch (err) {
        console.error("Delete Course Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
