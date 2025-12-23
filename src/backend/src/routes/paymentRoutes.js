const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticate = require('../middlewares/authMiddleware');

// Initialize Checkout (Protected)
router.post('/checkout', authenticate, paymentController.createCheckoutSession);

// Webhook (Public, but verified signature)
// Note: In server_mvc.js, make sure bodyParser.json() handles raw body for this route if needed
// For simplicity in this demo, we accept JSON, assuming a parser middleware handles it, 
// OR we might need 'express.raw({type: 'application/json'})' for strict signature verification.
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router;
