import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export interface UseStripeCheckoutOptions {
  publishableKey: string;
  createSessionUrl?: string;
  onRedirect?: () => void;
}

export interface UseStripeCheckoutReturn {
  redirect: (sessionId?: string | null, payload?: Record<string, unknown>) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

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
        if (!id) {
          const res = await fetch(createSessionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(`Failed to create session (status ${res.status})`);
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
