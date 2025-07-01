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
        console.log('Request body is Base64 encoded. Decoding...');
        const decodedBody = Buffer.from(event.body || '', 'base64').toString('utf-8');
        requestBody = JSON.parse(decodedBody);
      } else {
        console.log('Parsing plain text request body...');
        requestBody = JSON.parse(event.body || '{}');
      }
    } catch (parseError: any) {
      console.error('Error parsing request body:', parseError);
      return { statusCode: 400, body: `Invalid request body: ${parseError.message}` };
    }

    console.log('Parsed request body:', requestBody);
    const { priceId } = requestBody;

    if (!priceId) {
      console.error('Error: priceId is missing from request body.');
      return { statusCode: 400, body: 'Missing priceId' };
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${event.headers.origin}/success`,
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
