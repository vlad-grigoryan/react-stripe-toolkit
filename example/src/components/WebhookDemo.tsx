import React, { useState } from 'react';
import '../styles/WebhookDemo.css';

// Local copy of event types for demo purposes
// In a real implementation, you would import from 'react-stripe-toolkit'
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

export const WebhookDemo: React.FC = () => {
    const [eventType, setEventType] = useState<StripeEventType>(StripeEventType.PaymentIntentSucceeded);
    const [response, setResponse] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Function to simulate sending a webhook event to our mock server
    const simulateWebhookEvent = async () => {
        setLoading(true);
        setResponse(null);
        
        try {
            // Create a mock event payload
            const eventPayload = {
                id: `evt_${Math.random().toString(36).substring(2, 15)}`,
                type: eventType,
                created: Math.floor(Date.now() / 1000),
                data: {
                    object: {
                        id: `pi_${Math.random().toString(36).substring(2, 15)}`,
                        object: eventType.startsWith('payment_intent') ? 'payment_intent' :
                                eventType.startsWith('checkout.session') ? 'checkout.session' :
                                eventType.startsWith('customer.subscription') ? 'subscription' : 'unknown',
                        amount: 2000,
                        currency: 'usd',
                        status: 'succeeded'
                    }
                }
            };
            
            // Send to our Netlify function endpoint
            const res = await fetch('/.netlify/functions/handle-webhook', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // In a real implementation, you would need to create a valid signature
                    'Stripe-Signature': 'mock_signature'
                },
                body: JSON.stringify(eventPayload),
            });
            
            const data = await res.json();
            setResponse(JSON.stringify(data, null, 2));
        } catch (err) {
            setResponse(`Error: ${(err as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to format event type for display
    const formatEventType = (type: string): string => {
        return type
            .split('.')
            .map(part => part
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
            )
            .join(' - ');
    };

    return (
        <div className="demo-section">
            <h2>Webhook Demo</h2>
            <div className="webhook-demo">
                <div className="form-group">
                    <label htmlFor="eventType">Event Type:</label>
                    <select 
                        id="eventType" 
                        value={eventType} 
                        onChange={e => setEventType(e.target.value as StripeEventType)}
                    >
                        {Object.values(StripeEventType).map(type => (
                            <option key={type} value={type}>{formatEventType(type)}</option>
                        ))}
                    </select>
                </div>
                
                <button 
                    className="pay" 
                    onClick={simulateWebhookEvent}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Webhook Event'}
                </button>
                
                {response && (
                    <div className="response">
                        <h4>Response:</h4>
                        <pre>{response}</pre>
                    </div>
                )}
                
                <p className="note">
                    <strong>Note:</strong> Check the server console to see the event handling in action.
                </p>
            </div>
            
            <hr />
            
            <h3>Webhook Utilities Documentation</h3>
            
            <h4>StripeEventType Enum</h4>
            <p>A comprehensive list of Stripe webhook event types.</p>
            <pre><code>{`import { StripeEventType } from 'react-stripe-toolkit';

// Example usage
if (event.type === StripeEventType.PaymentIntentSucceeded) {
  // Handle successful payment
}`}</code></pre>
            
            <h4>Type Guards</h4>
            <p>Functions to check if an event belongs to a specific category:</p>
            <pre><code>{`import { 
  isPaymentIntentEvent,
  isSubscriptionEvent,
  isCheckoutSessionEvent 
} from 'react-stripe-toolkit';

// Example usage
if (isPaymentIntentEvent(event)) {
  // This is a payment intent event
}`}</code></pre>
            
            <h4>Type Casting</h4>
            <p>Helper functions to safely cast events to their specific types:</p>
            <pre><code>{`import { asPaymentIntentEvent } from 'react-stripe-toolkit';

// Example usage
const paymentEvent = asPaymentIntentEvent(event);
if (paymentEvent) {
  const paymentIntent = paymentEvent.data.object;
  console.log(paymentIntent.amount);
}`}</code></pre>
            
            <h4>Creating Webhook Handlers</h4>
            <p>Utility function to create type-safe webhook handlers:</p>
            <pre><code>{`import { createStripeWebhookHandler, StripeEventType } from 'react-stripe-toolkit';

// Example usage
const webhookHandler = createStripeWebhookHandler([
  {
    events: StripeEventType.PaymentIntentSucceeded,
    handler: async (event) => {
      // Handle successful payment
    }
  },
  {
    events: [
      StripeEventType.CustomerSubscriptionCreated,
      StripeEventType.CustomerSubscriptionUpdated
    ],
    handler: async (event) => {
      // Handle subscription events
    }
  }
]);

// Use in your webhook endpoint
app.post('/webhook', async (req, res) => {
  const event = /* construct event from request */;
  await webhookHandler(event);
  res.json({ received: true });
});`}</code></pre>
            
            <h4>Server-side Implementation</h4>
            <p>
                In a real application, webhook handling is typically done on the server.
                The example above demonstrates client-side usage for learning purposes,
                but in production, you would verify signatures and process events server-side.
            </p>
        </div>
    );
};
