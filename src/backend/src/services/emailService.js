const nodemailer = require('nodemailer');

// Mock Transport if config missing
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'ethereal_user',
        pass: process.env.SMTP_PASS || 'ethereal_pass'
    }
});

exports.sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: '"Ecole Facile" <no-reply@ecolefacile.com>',
            to,
            subject,
            html
        });
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (err) {
        console.error("Email Send Error:", err);
        return false;
    }
};
