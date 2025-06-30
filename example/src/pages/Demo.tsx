import React from 'react';
import { useStripeCheckout } from 'react-stripe-toolkit';

export const Demo: React.FC = () => {
  const { redirect, loading, error } = useStripeCheckout({
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    createSessionUrl: '/.netlify/functions/create-checkout-session',
  });

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto', textAlign: 'center' }}>
      <h1>react-stripe-toolkit Demo</h1>
      <p>$42.00 demo product</p>
      <ol style={{ textAlign: 'left', margin: '1rem auto', maxWidth: 360, fontSize: '0.9rem' }}>
        <li>
          Create <code>.env</code> in <code>example/</code> with your keys:<br />
          <code>VITE_STRIPE_PUBLISHABLE_KEY=&lt;pk_test_…&gt;</code><br />
          <code>STRIPE_SECRET_KEY=&lt;sk_test_…&gt;</code>
        </li>
        <li>
          In the Stripe Dashboard, create a test product and copy its <strong>Price ID</strong>.
        </li>
        <li>
          Replace the <code>priceId</code> in the button handler below with your real one.
        </li>
        <li>
          Run <code>npm run dev</code> and click &ldquo;Pay with Stripe&rdquo;.
        </li>
      </ol>
      <button
        style={{ padding: '0.7rem 1.5rem', fontSize: '1rem' }}
        onClick={() => redirect(undefined, { priceId: 'price_1RdvbqIHB2OP6EfUf1c5Slgy' })}
        disabled={loading}
      >
        {loading ? 'Redirecting…' : 'Pay with Stripe'}
      </button>
      {error && <p style={{ color: 'red' }}>{error.message}</p>}
    </div>
  );
};
