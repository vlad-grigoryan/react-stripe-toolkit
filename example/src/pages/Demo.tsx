import React, { useState } from 'react';
import { useStripeCheckout, useStripeSubscription } from 'react-stripe-toolkit';

// This reference is for Vite environments to provide type definitions for env variables
/// <reference types="vite/client" />

const SetupGuide: React.FC = () => (
    <div className="content-section">
        <h2>Setup Guide</h2>
        <ol className="checklist">
            <li>
                Create a <code>.env</code> file in the <code>/example</code> directory with your Stripe keys:
                <br />
                <code>VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...</code>
                <br />
                <code>STRIPE_SECRET_KEY=sk_test_...</code>
            </li>
            <li>In your Stripe Dashboard, create a test product and copy its Price ID.</li>
            <li>
                In <code>CheckoutDemo.tsx</code>, replace the placeholder <code>price_...</code> with your own Price ID.
            </li>
            <li>Run <code>npm run dev</code> from your terminal and click the “Pay with Stripe” button.</li>
        </ol>
    </div>
);

const CheckoutDemo: React.FC = () => {
    const { redirect, loading, error } = useStripeCheckout({
        // The publishable key is safely exposed to the client-side
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        // This URL points to a serverless function that creates the Checkout Session
        createSessionUrl: '/.netlify/functions/create-checkout-session',
    });

    return (
        <div className="content-section">
            <h2>Checkout Demo</h2>
            <p className="price">$42.00 — Demo Product</p>
            <button
                className="pay"
                onClick={() => redirect(undefined, { priceId: 'price_1RdvbqIHB2OP6EfUf1c5Slgy' })} // <-- CRITICAL: REPLACE THIS with a valid Price ID from your Stripe Dashboard.
                disabled={loading}
            >
                {loading ? 'Redirecting to Stripe…' : 'Pay with Stripe'}
            </button>
            {error && <p className="error">Error: {error.message}</p>}
        </div>
    );
};

const SubscriptionDemo: React.FC = () => {
    const { subscribe, loading, error } = useStripeSubscription({
        publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        createSessionUrl: '/.netlify/functions/create-subscription-session',
    });

    return (
        <div className="content-section">
            <h2>Subscription Demo</h2>
            <p className="price">$15.00/month — Pro Plan</p>
            <button
                className="pay"
                onClick={() => subscribe({ priceId: 'price_1Rigm6IHB2OP6EfUCDtLd5k7' })} // <-- CRITICAL: REPLACE THIS with a valid recurring Price ID from your Stripe Dashboard.
                disabled={loading}
            >
                {loading ? 'Redirecting to Stripe…' : 'Subscribe Now'}
            </button>
            {error && <p className="error">Error: {error.message}</p>}
        </div>
    );
};

export const Demo: React.FC = () => {
    const [activeView, setActiveView] = useState<'setup' | 'checkout' | 'subscription'>('setup');

    const renderContent = () => {
        switch (activeView) {
            case 'checkout':
                return <CheckoutDemo />;
            case 'subscription':
                return <SubscriptionDemo />;
            case 'setup':
            default:
                return <SetupGuide />;
        }
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <h1>react-stripe-toolkit</h1>
                <nav>
                    <button
                        type="button"
                        className={activeView === 'setup' ? 'active' : ''}
                        onClick={() => setActiveView('setup')}
                    >
                        Setup Guide
                    </button>
                    <button
                        type="button"
                        className={activeView === 'checkout' ? 'active' : ''}
                        onClick={() => setActiveView('checkout')}
                    >
                        Checkout Demo
                    </button>
                    <button
                        type="button"
                        className={activeView === 'subscription' ? 'active' : ''}
                        onClick={() => setActiveView('subscription')}
                    >
                        Subscription Demo
                    </button>
                </nav>
            </aside>

            <main className="main-pane">
                {renderContent()}
            </main>
        </div>
    );
};
