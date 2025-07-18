// src/hooks/useStripeWebhook.ts
import {useState, useCallback} from 'react';
import {Stripe} from 'stripe';
import {
    StripeEventType,
    createStripeWebhookHandler
} from '../utils/stripeWebhooks';

export interface WebhookHandler {
    events: StripeEventType | StripeEventType[];
    handler: (event: Stripe.Event) => Promise<void> | void;
}

export interface UseStripeWebhookOptions {
    secretKey?: string;
    endpointSecret?: string;
    handlers: WebhookHandler[];
}

export interface UseStripeWebhookReturn {
    handleWebhook: (payload: Buffer | string, signature: string) => Promise<{
        received: boolean;
        error?: Error;
    }>;
    loading: boolean;
    error: Error | null;
}

export function useStripeWebhook({
                                     secretKey,
                                     endpointSecret,
                                     handlers,
                                 }: UseStripeWebhookOptions): UseStripeWebhookReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleWebhook = useCallback(
        async (payload: Buffer | string, signature: string) => {
            if (!secretKey) {
                const err = new Error('Stripe secretKey is required');
                setError(err);
                return {received: false, error: err};
            }

            if (!endpointSecret) {
                const err = new Error('Stripe endpointSecret is required');
                setError(err);
                return {received: false, error: err};
            }

            setLoading(true);
            setError(null);

            try {
                // This would typically be done server-side, but provided for completeness
                const stripe = new Stripe(secretKey, {apiVersion: '2024-04-10'});

                // Verify the webhook signature
                const event = stripe.webhooks.constructEvent(
                    payload,
                    signature,
                    endpointSecret
                );

                // Process the event using our handlers
                const webhookHandler = createStripeWebhookHandler(handlers);
                await webhookHandler(event);

                setLoading(false);
                return {received: true};
            } catch (e) {
                const err = e as Error;
                setError(err);
                setLoading(false);
                return {received: false, error: err};
            }
        },
        [secretKey, endpointSecret, handlers]
    );

    return {
        handleWebhook,
        loading,
        error,
    };
}
