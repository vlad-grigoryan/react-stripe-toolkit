# react-stripe-toolkit
“Lightweight TypeScript hooks and components that make Stripe Checkout and other Stripe flows effortless in React.”

[![Live Demo](https://img.shields.io/badge/demo-netlify-brightgreen?logo=netlify)](https://coruscating-gumption-4ce6a7.netlify.app/)

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
