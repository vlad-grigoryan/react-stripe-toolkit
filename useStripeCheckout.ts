import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export interface UseStripeCheckoutOptions {
  /** Your Stripe publishable key (pk_live_... or pk_test_...) */
  publishableKey: string;
  /**
   * Optional endpoint that returns `{ id: string }` for a new Checkout Session.
   * Defaults to `/api/create-checkout-session`.
   */
  createSessionUrl?: string;
  /** Called right after `redirectToCheckout` is invoked. */
  onRedirect?: () => void;
}

export interface UseStripeCheckoutReturn {
  /**
   * Redirect the browser to Stripe Checkout.
   *
   * If you already have a sessionId, pass it as the first argument.
   * Otherwise the hook will POST to `createSessionUrl` with `payload` (second arg)
   * to obtain one before redirecting.
   */
  redirect: (sessionId?: string | null, payload?: Record<string, unknown>) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

/**
 * React hook to simplify client-side Stripe Checkout redirection.
 * Keeps your secret key on the server; the hook only needs the publishable key.
 */
export function useStripeCheckout({
  publishableKey,
  createSessionUrl = '/api/create-checkout-session',
  onRedirect,
}: UseStripeCheckoutOptions): UseStripeCheckoutReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const redirect = useCallback(
    async (sessionId?: string | null, payload: Record<string, unknown> = {}) => {
      setLoading(true);
      setError(null);
      try {
        let id = sessionId ?? null;

        // If no sessionId provided, create one via backend.
        if (!id) {
          const res = await fetch(createSessionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) {
            throw new Error(`Failed to create session (status ${res.status})`);
          }
          const json = (await res.json()) as { id?: string };
          id = json.id ?? null;
          if (!id) throw new Error('Backend response missing `id`');
        }

        const stripe = await loadStripe(publishableKey);
        if (!stripe) throw new Error('Stripe.js failed to load');

        const { error } = await stripe.redirectToCheckout({ sessionId: id });
        if (error) throw error;

        onRedirect?.();
      } catch (e) {
        setError(e as Error);
        setLoading(false);
      }
    },
    [publishableKey, createSessionUrl, onRedirect]
  );

  return { redirect, loading, error };
}
