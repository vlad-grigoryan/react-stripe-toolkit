import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10',
});

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    let requestBody;
    try {
      if (event.isBase64Encoded) {
        const decodedBody = Buffer.from(event.body || '', 'base64').toString('utf-8');
        requestBody = JSON.parse(decodedBody);
      } else {
        requestBody = JSON.parse(event.body || '{}');
      }
    } catch (parseError: any) {
      console.error('Error parsing request body:', parseError);
      return { statusCode: 400, body: `Invalid request body: ${parseError.message}` };
    }

    const { priceId } = requestBody;

    if (!priceId) {
      console.error('Error: priceId is missing from request body.');
      return { statusCode: 400, body: 'Missing priceId' };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', // The key change for subscriptions
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${event.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin}/canceled`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (err: any) {
    console.error('Stripe API error:', err.message);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
