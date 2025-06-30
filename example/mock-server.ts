import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';

const app = express();
app.use(express.json());

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error('Missing STRIPE_SECRET_KEY in .env');
  process.exit(1);
}
const stripe = new Stripe(stripeSecret, {
  apiVersion: '2024-04-10',
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, quantity = 1 } = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity }],
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });
    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: (err as Error).message });
  }
});

app.listen(4242, () => console.log('Stripe mock server running on http://localhost:4242'));
