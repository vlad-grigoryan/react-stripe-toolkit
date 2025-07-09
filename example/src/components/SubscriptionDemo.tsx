import React from 'react';
// The hook is imported from the library's entry point
import { useStripeSubscription } from 'react-stripe-toolkit';

export const SubscriptionDemo: React.FC = () => {
    // The hook is called with the required options
    const { loading, error, subscribe } = useStripeSubscription({
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        createSessionUrl: '/.netlify/functions/create-subscription-session',
    });

    return (
        <div className="demo-section">
            <h2>Subscription Demo</h2>
            <p>This demo shows a recurring payment flow using the <code>useStripeSubscription</code> hook.</p>

            <div className="product-card">
                <h3>Pro Plan</h3>
                <p className="price">$15.00/month</p>
                <button
                    className="pay"
                    // The subscribe function is called with the priceId
                    onClick={() => subscribe({ priceId: 'price_1Rigm6IHB2OP6EfUCDtLd5k7' })}
                    disabled={loading}
                >
                    {loading ? 'Redirecting to Stripe…' : 'Subscribe Now'}
                </button>
                {error && <p className="error">Error: {error.message}</p>}
            </div>

            <hr />

            <h3><code>useStripeSubscription</code> Hook Documentation</h3>

            <h4>Description</h4>
            <p>A custom React hook to manage the Stripe Checkout flow for recurring subscriptions. It handles loading states, creates a subscription session via a serverless function, and redirects the user to the Stripe Checkout page.</p>

            <h4>Syntax</h4>
            <pre><code>{`const { loading, error, subscribe } = useStripeSubscription(options);`}</code></pre>

            <h4>Parameters</h4>
            <p>The hook accepts an <code>options</code> object with the following properties:</p>
            <ul>
                <li><strong>publishableKey:</strong> (string) - <strong>Required.</strong> Your Stripe publishable API key.</li>
                <li><strong>createSessionUrl:</strong> (string) - <em>Optional.</em> The URL of your serverless function that creates the session. Defaults to <code>/api/create-subscription-session</code>.</li>
                <li><strong>onRedirect:</strong> (function) - <em>Optional.</em> A callback function that is called just before the redirect to Stripe happens.</li>
            </ul>

            <h4>Returns</h4>
            <p>An object containing:</p>
            <ul>
                <li><strong>loading:</strong> (boolean) - <code>true</code> when the subscription process is in progress.</li>
                <li><strong>error:</strong> (Error | null) - An error object if the process fails, otherwise <code>null</code>.</li>
                <li><strong>subscribe:</strong> (function) - The function to call to initiate the subscription process.</li>
            </ul>

            <h4><code>subscribe</code> Function</h4>
            <p>The function to initiate the Stripe Checkout redirect for a subscription.</p>
            <pre><code>{`subscribe({ priceId: string })`}</code></pre>
            <ul>
                <li><strong>priceId:</strong> (string) - <strong>Required.</strong> The ID of the Stripe Price object for the recurring subscription plan.</li>
            </ul>

            <h4>Example</h4>
            <pre>
                <code>
{`import { useStripeSubscription } from 'react-stripe-toolkit';

const MyComponent = () => {
  const { loading, error, subscribe } = useStripeSubscription({
    publishableKey: 'pk_test_YOUR_KEY_HERE',
  });

  return (
    <div>
      <button 
        onClick={() => subscribe({ priceId: 'price_...' })} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Subscribe to Pro Plan'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};`}
                </code>
            </pre>
        </div>
    );
};
