const db = require('../../db');
// Initialize Stripe with secret key from env
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
    const { course_id } = req.body;
    const userId = req.user.id;

    if (!course_id) return res.status(400).json({ error: "Course ID requis" });

    try {
        // Fetch course details
        const courseRes = await db.query("SELECT * FROM courses WHERE id = $1", [course_id]);
        if (courseRes.rows.length === 0) return res.status(404).json({ error: "Cours non trouvé" });
        const course = courseRes.rows[0];

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: course.title,
                        images: course.thumbnail_url ? [course.thumbnail_url] : [],
                    },
                    unit_amount: Math.round(course.price * 100) || 1000, // Price in cents. Fallback 10 EUR for demo
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/cancel`,
            metadata: {
                user_id: userId,
                course_id: course_id
            },
        });

        res.json({ url: session.url, id: session.id });
    } catch (err) {
        console.error("Create Checkout Error:", err);
        // Handle missing API key gracefully for demo
        if (err.type === 'StripeAuthenticationError') {
            return res.status(500).json({ error: "Erreur de configuration Stripe (Clé API manquante)" });
        }
        res.status(500).json({ error: "Erreur serveur" });
    }
};

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // In a real app, use the raw body for signature verification
        // req.rawBody needs to be enabled in express
        event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { user_id, course_id } = session.metadata;

        try {
            // 1. Log Payment
            await db.query(`
                INSERT INTO payments (user_id, course_id, amount, currency, provider, provider_payment_id, status)
                VALUES ($1, $2, $3, $4, 'stripe', $5, 'succeeded')
            `, [user_id, course_id, session.amount_total / 100, session.currency, session.payment_intent]);

            // 2. Enroll User
            await db.query(`
                INSERT INTO enrollments (user_id, course_id, status)
                VALUES ($1, $2, 'active')
                ON CONFLICT (user_id, course_id) DO NOTHING
            `, [user_id, course_id]);

            console.log(`Payment successful & User ${user_id} enrolled in ${course_id}`);

        } catch (dbErr) {
            console.error("Error processing successful payment:", dbErr);
            return res.status(500).end();
        }
    }

    res.json({ received: true });
};
