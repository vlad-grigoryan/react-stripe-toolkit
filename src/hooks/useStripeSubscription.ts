import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';

export interface UseStripeSubscriptionOptions {
  publishableKey: string;
  createSessionUrl?: string;
  onRedirect?: () => void;
}

export interface UseStripeSubscriptionReturn {
  subscribe: (payload?: Record<string, unknown>) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useStripeSubscription({
  publishableKey,
  createSessionUrl = '/api/create-subscription-session',
  onRedirect,
}: UseStripeSubscriptionOptions): UseStripeSubscriptionReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const subscribe = useCallback(
    async (payload: Record<string, unknown> = {}) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(createSessionUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload), // The payload must contain the priceId
        });

        if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(`Failed to create subscription session (status ${res.status}): ${errorBody}`);
        }
        
        const json = (await res.json()) as { id?: string };
        const id = json.id ?? null;
        if (!id) throw new Error('Backend response for subscription session is missing `id`');

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

  return { subscribe, loading, error };
}
