# react-stripe-toolkit

A lightweight React library that simplifies integrating Stripe Checkout into your application. This toolkit provides a custom hook, `useStripeCheckout`, that manages the loading state, errors, and redirection flow for you, making your Stripe integration clean and straightforward.

## [Live Demo](https://coruscating-gumption-4ce6a7.netlify.app/)

## Installation

```bash
npm install react-stripe-toolkit
```

or

```bash
yarn add react-stripe-toolkit
```

## Available Hooks

| Hook                | Description                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `useStripeCheckout` | A hook to handle the entire Stripe Checkout redirection flow, including session creation and error handling. |
| `useStripeSubscription` | A hook to handle the Stripe Checkout flow for creating recurring subscriptions. |

## Running the Demo Locally

To run the included example application on your machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/vlad-grigoryan/react-stripe-toolkit.git
    cd react-stripe-toolkit
    ```

2.  **Install root dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the example:**
    Navigate to the example directory and create a `.env` file.
    ```bash
    cd example
    touch .env
    ```

4.  **Add your Stripe keys to `.env`:**
    You'll need your Stripe publishable key and secret key.
    ```
    VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
    STRIPE_SECRET_KEY=sk_test_...
    ```

5.  **Install example dependencies and run:**
    ```bash
    npm install
    npm run dev
    ```

The demo will be available at `http://localhost:5173`.

## Why `react-stripe-toolkit`?

The goal of this toolkit is to abstract away the boilerplate and complexity of setting up Stripe Checkout in a React application. By using the `useStripeCheckout` hook, you get:

-   **Simplified Logic:** No need to write repetitive fetch requests or manage loading and error states manually.
-   **Serverless Ready:** Designed to work seamlessly with serverless functions for creating checkout sessions.
-   **Easy to Use:** A clean and minimal API that gets you up and running with Stripe in minutes.
-   **Lightweight:** A small package with a focused purpose.

## License

MIT


---

## Installation

```bash
npm install react-stripe-toolkit @stripe/stripe-js
```

Requires React 17+, TypeScript optional.

## Quick Start

```tsx
import { useStripeCheckout } from 'react-stripe-toolkit';

export function PayButton() {
  const { redirect, loading, error } = useStripeCheckout({
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  });

  return (
    <button
      disabled={loading}
      onClick={() => redirect(undefined, { priceId: '<your_price_id>' })}
    >
      {loading ? 'Redirecting…' : 'Pay with Stripe'}
    </button>
  );
}
```

`redirect()` accepts either an existing `sessionId` or payload for your backend to create one. See [`useStripeCheckout`](./src/hooks/useStripeCheckout.ts) for full API.

## Example App (local)

A complete Vite demo lives in `example/`.

```bash
git clone https://github.com/vlad-grigoryan/react-stripe-toolkit.git
cd react-stripe-toolkit

# create env file with your keys
cp example/.env.example example/.env
# edit example/.env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

npm install          # installs root + example deps
npm --prefix example run dev   # opens http://localhost:5173
```

## Live Demo

The exact same demo is deployed on Netlify: <https://coruscating-gumption-4ce6a7.netlify.app/>.

## Deploying Your Own Demo (Netlify)

1. Copy this repo and push to GitHub.
2. In Netlify → "Add new site" → "Import from GitHub".
3. Add env vars `VITE_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.
4. Netlify picks up `netlify.toml`, builds `example/`, and deploys.

## Contributing
Pull requests and issues are welcome! Please open an issue first to discuss major changes.

## License

MIT © 2025 Vlad Grigoryan
