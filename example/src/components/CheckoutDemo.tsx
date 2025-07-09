import React from 'react';
// The hook is imported from the library's entry point
import { useStripeCheckout } from 'react-stripe-toolkit';

export const CheckoutDemo: React.FC = () => {
    // The hook is called with the required options
    const { loading, error, redirect } = useStripeCheckout({
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        createSessionUrl: '/.netlify/functions/create-checkout-session',
    });

    return (
        <div className="demo-section">
            <h2>Checkout Demo</h2>
            <p>This demo shows a one-time payment flow using the <code>useStripeCheckout</code> hook.</p>

            <div className="product-card">
                <h3>Standard Plan</h3>
                <p className="price">$42.00</p>
                <button
                    className="pay"
                    // The checkout function is called with the priceId
                    onClick={() => redirect(undefined, { priceId: 'price_1RdvbqIHB2OP6EfUf1c5Slgy' })} // <-- CRITICAL: REPLACE THIS with a valid one-time Price ID from your Stripe Dashboard.
                    disabled={loading}
                >
                    {loading ? 'Redirecting to Stripe…' : 'Buy Now'}
                </button>
                {error && <p className="error">Error: {error.message}</p>}
            </div>

            <hr />

            <h3><code>useStripeCheckout</code> Hook Documentation</h3>

            <h4>Description</h4>
            <p>A custom React hook to manage the Stripe Checkout flow for one-time payments. It handles loading states, creates a checkout session via a serverless function, and redirects the user to the Stripe Checkout page.</p>

            <h4>Syntax</h4>
            <pre><code>{`const { loading, error, redirect } = useStripeCheckout(options);`}</code></pre>

            <h4>Parameters</h4>
            <p>The hook accepts an <code>options</code> object with the following properties:</p>
            <ul>
                <li><strong>publishableKey:</strong> (string) - <strong>Required.</strong> Your Stripe publishable API key.</li>
                <li><strong>createSessionUrl:</strong> (string) - <em>Optional.</em> The URL of your serverless function that creates the session. Defaults to <code>/api/create-checkout-session</code>.</li>
                <li><strong>onRedirect:</strong> (function) - <em>Optional.</em> A callback function that is called just before the redirect to Stripe happens.</li>
            </ul>

            <h4>Returns</h4>
            <p>An object containing:</p>
            <ul>
                <li><strong>loading:</strong> (boolean) - <code>true</code> when the checkout process is in progress (e.g., fetching the session or redirecting).</li>
                <li><strong>error:</strong> (Error | null) - An error object if the process fails, otherwise <code>null</code>.</li>
                <li><strong>redirect:</strong> (function) - The function to call to initiate the checkout process.</li>
            </ul>

            <h4><code>redirect</code> Function</h4>
            <p>The function to initiate the Stripe Checkout redirect.</p>
            <pre><code>{`redirect(sessionId, { priceId: string })`}</code></pre>
            <ul>
                <li><strong>priceId:</strong> (string) - <strong>Required.</strong> The ID of the Stripe Price object for the product being purchased.</li>
            </ul>

            <h4>Example</h4>
            <pre>
                <code>
{`import { useStripeCheckout } from 'react-stripe-toolkit';

const MyComponent = () => {
  const { loading, error, redirect } = useStripeCheckout({
    publishableKey: 'pk_test_YOUR_KEY_HERE',
  });

  return (
    <div>
      <button 
        onClick={() => redirect(undefined, { priceId: 'price_1RdvbqIHB2OP6EfUf1c5Slgy' })} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Purchase for $10'}
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
