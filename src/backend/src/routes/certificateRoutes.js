const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const authenticate = require('../middlewares/authMiddleware');

router.post('/generate', authenticate, certificateController.generateCertificate);
router.get('/', authenticate, certificateController.getUserCertificates);

module.exports = router;
