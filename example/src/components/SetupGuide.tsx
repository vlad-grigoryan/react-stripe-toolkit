import React from 'react';

export const SetupGuide: React.FC = () => {
    return (
        <div className="setup-guide">
            <h2>Setup Guide</h2>
            <p>Follow these steps to get the demo running:</p>
            <ol>
                <li>
                    <strong>Clone the repository and install dependencies:</strong>
                    <pre><code>git clone https://github.com/vlad-grigoryan/react-stripe-toolkit.git
cd react-stripe-toolkit
npm install</code></pre>
                </li>
                <li>
                    <strong>Build the library:</strong>
                    <pre><code>npm run build</code></pre>
                </li>
                <li>
                    <strong>Set up environment variables:</strong>
                    <p>Navigate to the <code>/example</code> directory and create a <code>.env</code> file. Add your Stripe keys:</p>
                    <pre><code>VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...</code></pre>
                </li>
                <li>
                    <strong>Run the demo application:</strong>
                    <pre><code>npm --prefix example run dev</code></pre>
                </li>
                <li>
                    <strong>Update Price IDs in the demo components:</strong>
                    <p>Replace the placeholder Price IDs in <code>CheckoutDemo.tsx</code> and <code>SubscriptionDemo.tsx</code> with valid IDs from your Stripe Dashboard.</p>
                </li>
            </ol>

            <hr />

            <h3>Description</h3>
            <p>This component provides a step-by-step guide to setting up and running the `react-stripe-toolkit` demo application locally.</p>

            <h3>Syntax</h3>
            <pre><code>&lt;SetupGuide /&gt;</code></pre>

            <h3>Parameters</h3>
            <p>This component accepts no props.</p>

            <h3>Returns</h3>
            <p>A React component that renders the setup instructions.</p>
        </div>
    );
};
