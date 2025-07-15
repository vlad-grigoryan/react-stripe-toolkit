import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-04-10',
});

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { customerId } = JSON.parse(event.body || '{}');

        if (!customerId) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Customer ID is required.' }) };
        }

        // List all invoices for the given customer
        const invoices = await stripe.invoices.list({
            customer: customerId,
            limit: 100, // You can adjust the limit as needed
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ invoices: invoices.data }),
        };

    } catch (error: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};
