const db = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for Resources
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../resources');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'res-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        // Allow common doc and video types
        const filetypes = /pdf|doc|docx|mp4|webm|zip|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        // Mimetype check can be tricky for all types, reliable extension check for this demo
        if (extname) return cb(null, true);
        cb(new Error('Format de fichier non supporté'));
    }
});

exports.uploadResourceMiddleware = upload.single('file');

exports.createResource = async (req, res) => {
    const { lesson_id, type, title, url } = req.body;
    let fileUrl = url;
    let fileSize = 0;

    if (req.file) {
        fileUrl = `/resources/${req.file.filename}`;
        fileSize = req.file.size;
    }

    if (!lesson_id || !type || !fileUrl) {
        return res.status(400).json({ error: "Lesson ID, Type et URL/Fichier requis" });
    }

    try {
        const result = await db.query(
            "INSERT INTO resources (lesson_id, type, url, title, size) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [lesson_id, type, fileUrl, title || req.file?.originalname, fileSize]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create Resource Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getResourcesByLesson = async (req, res) => {
    const { lessonId } = req.params;
    try {
        const result = await db.query("SELECT * FROM resources WHERE lesson_id = $1 ORDER BY created_at DESC", [lessonId]);
        res.json(result.rows);
    } catch (err) {
        console.error("Get Resources Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.deleteResource = async (req, res) => {
    const { id } = req.params;
    try {
        // TODO: Delete file from disk if local
        await db.query("DELETE FROM resources WHERE id = $1", [id]);
        res.sendStatus(204);
    } catch (err) {
        console.error("Delete Resource Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
