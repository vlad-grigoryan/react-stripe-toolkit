import { Handler } from '@netlify/functions';

// Define Stripe event types locally to avoid import issues
enum StripeEventType {
  // Payment Intent events
  PaymentIntentSucceeded = 'payment_intent.succeeded',
  PaymentIntentFailed = 'payment_intent.payment_failed',
  
  // Checkout Session events
  CheckoutSessionCompleted = 'checkout.session.completed',
  
  // Subscription events
  CustomerSubscriptionCreated = 'customer.subscription.created',
  CustomerSubscriptionUpdated = 'customer.subscription.updated',
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // In a real implementation, you would verify the webhook signature
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {apiVersion: '2023-10-16'});
    // const signature = event.headers['stripe-signature'];
    // const stripeEvent = stripe.webhooks.constructEvent(
    //   event.body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET
    // );
    
    // For the demo, we'll process the event directly
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ received: false, error: 'Missing request body' })
      };
    }
    
    let stripeEvent;
    try {
      stripeEvent = JSON.parse(event.body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Body:', event.body);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          received: false, 
          error: `Invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
          bodyPreview: event.body.substring(0, 100) // Show beginning of body for debugging
        })
      };
    }
    
    console.log(`Webhook received: ${stripeEvent.type}`);
    
    // Process the event based on its type
    switch (stripeEvent.type) {
      case StripeEventType.PaymentIntentSucceeded:
        console.log('✅ Payment succeeded!');
        break;
      case StripeEventType.PaymentIntentFailed:
        console.log('❌ Payment failed.');
        break;
      case StripeEventType.CheckoutSessionCompleted:
        console.log('✅ Checkout session completed!');
        break;
      case StripeEventType.CustomerSubscriptionCreated:
        console.log('✅ Subscription created!');
        break;
      case StripeEventType.CustomerSubscriptionUpdated:
        console.log('ℹ️ Subscription updated.');
        break;
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error('Webhook error:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        received: false, 
        error: err instanceof Error ? err.message : 'Unknown error' 
      }),
    };
  }
};
