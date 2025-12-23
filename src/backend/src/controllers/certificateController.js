const db = require('../../db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateCertificate = async (req, res) => {
    const { course_id } = req.body;
    const userId = req.user.id;

    try {
        // 1. Verify Completion (100% progress)
        // Simplified check: Check if status is completed in enrollments or progress calc
        // For now, let's assume client triggers this after seeing 100%
        // Robust way: recalculate progress here.

        // Fetch User and Course details
        const userRes = await db.query("SELECT full_name FROM users WHERE id = $1", [userId]);
        const courseRes = await db.query("SELECT title FROM courses WHERE id = $1", [course_id]);

        if (userRes.rows.length === 0 || courseRes.rows.length === 0) {
            return res.status(404).json({ error: "Utilisateur ou Cours introuvable" });
        }

        const userName = userRes.rows[0].full_name;
        const courseName = courseRes.rows[0].title;

        // Check if certificate already exists
        const existingCert = await db.query(
            "SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2",
            [userId, course_id]
        );
        if (existingCert.rows.length > 0) {
            return res.json(existingCert.rows[0]);
        }

        // 2. Generate PDF
        const doc = new PDFDocument({ layout: 'landscape', size: 'A4' });
        const fileName = `cert-${userId}-${course_id}-${Date.now()}.pdf`;
        const filePath = path.join(__dirname, '../../resources/certificates', fileName);

        // Ensure directory exists
        const dirPath = path.dirname(filePath);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // PDF Content Design
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
        doc.lineWidth(20);
        doc.strokeColor('#4F46E5').rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

        doc.moveDown(2);
        doc.fillColor('#000').font('Helvetica-Bold').fontSize(40).text('CERTIFICAT D\'ACCOMPLISSEMENT', { align: 'center' });

        doc.moveDown();
        doc.font('Helvetica').fontSize(20).text('Ce certificat est décerné à', { align: 'center' });

        doc.moveDown();
        doc.fillColor('#4F46E5').font('Helvetica-Bold').fontSize(30).text(userName, { align: 'center' });

        doc.moveDown();
        doc.fillColor('#000').font('Helvetica').fontSize(20).text('pour avoir complété avec succès le cours', { align: 'center' });

        doc.moveDown();
        doc.font('Helvetica-Bold').fontSize(25).text(courseName, { align: 'center' });

        doc.moveDown(2);
        doc.fontSize(15).text(`Délivré le ${new Date().toLocaleDateString('fr-FR')}`, { align: 'center' });

        doc.end();

        // Wait for file to write
        writeStream.on('finish', async () => {
            // 3. Save to DB
            const pdfUrl = `/resources/certificates/${fileName}`;
            const result = await db.query(
                "INSERT INTO certificates (user_id, course_id, pdf_url) VALUES ($1, $2, $3) RETURNING *",
                [userId, course_id, pdfUrl]
            );
            res.status(201).json(result.rows[0]);
        });

    } catch (err) {
        console.error("Certificate Generation Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.getUserCertificates = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query(
            "SELECT c.*, co.title as course_title, co.thumbnail_url FROM certificates c JOIN courses co ON c.course_id = co.id WHERE c.user_id = $1",
            [userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Get Certificates Error:", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
