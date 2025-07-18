// src/utils/stripeWebhooks.ts
import {Stripe} from 'stripe';

/**
 * Comprehensive enum of Stripe webhook event types
 */
export enum StripeEventType {
    // Payment Intent events
    PaymentIntentCreated = 'payment_intent.created',
    PaymentIntentSucceeded = 'payment_intent.succeeded',
    PaymentIntentFailed = 'payment_intent.payment_failed',
    PaymentIntentCanceled = 'payment_intent.canceled',
    PaymentIntentProcessing = 'payment_intent.processing',

    // Checkout Session events
    CheckoutSessionCompleted = 'checkout.session.completed',
    CheckoutSessionExpired = 'checkout.session.expired',

    // Subscription events
    CustomerSubscriptionCreated = 'customer.subscription.created',
    CustomerSubscriptionUpdated = 'customer.subscription.updated',
    CustomerSubscriptionDeleted = 'customer.subscription.deleted',
    CustomerSubscriptionPaused = 'customer.subscription.paused',
    CustomerSubscriptionResumed = 'customer.subscription.resumed',
    CustomerSubscriptionPendingUpdateApplied = 'customer.subscription.pending_update_applied',
    CustomerSubscriptionPendingUpdateExpired = 'customer.subscription.pending_update_expired',
    CustomerSubscriptionTrialWillEnd = 'customer.subscription.trial_will_end',

    // Invoice events
    InvoiceCreated = 'invoice.created',
    InvoiceFinalized = 'invoice.finalized',
    InvoicePaid = 'invoice.paid',
    InvoicePaymentSucceeded = 'invoice.payment_succeeded',
    InvoicePaymentFailed = 'invoice.payment_failed',
    InvoiceUpcoming = 'invoice.upcoming',
    InvoiceSent = 'invoice.sent',

    // Customer events
    CustomerCreated = 'customer.created',
    CustomerUpdated = 'customer.updated',
    CustomerDeleted = 'customer.deleted',

    // Card events
    PaymentMethodAttached = 'payment_method.attached',
    PaymentMethodDetached = 'payment_method.detached',
    PaymentMethodUpdated = 'payment_method.updated',

    // Disputes
    ChargeDisputeCreated = 'charge.dispute.created',
    ChargeDisputeClosed = 'charge.dispute.closed',
}

/**
 * Type guard functions to check event categories
 */
export function isPaymentIntentEvent(event: { type: string }): boolean {
    return event.type.startsWith('payment_intent.');
}

export function isCheckoutSessionEvent(event: { type: string }): boolean {
    return event.type.startsWith('checkout.session.');
}

export function isSubscriptionEvent(event: { type: string }): boolean {
    return event.type.startsWith('customer.subscription.');
}

export function isInvoiceEvent(event: { type: string }): boolean {
    return event.type.startsWith('invoice.');
}

export function isCustomerEvent(event: { type: string }): boolean {
    return event.type.startsWith('customer.') && !event.type.startsWith('customer.subscription.');
}

export function isPaymentMethodEvent(event: { type: string }): boolean {
    return event.type.startsWith('payment_method.');
}

export function isDisputeEvent(event: { type: string }): boolean {
    return event.type.startsWith('charge.dispute.');
}

/**
 * Type definitions for specific event data objects
 */
export type StripePaymentIntentEvent = Stripe.Event & {
    data: {
        object: Stripe.PaymentIntent;
    };
};

export type StripeCheckoutSessionEvent = Stripe.Event & {
    data: {
        object: Stripe.Checkout.Session;
    };
};

export type StripeSubscriptionEvent = Stripe.Event & {
    data: {
        object: Stripe.Subscription;
    };
};

export type StripeInvoiceEvent = Stripe.Event & {
    data: {
        object: Stripe.Invoice;
    };
};

export type StripeCustomerEvent = Stripe.Event & {
    data: {
        object: Stripe.Customer;
    };
};

/**
 * Helper function to safely cast event to a specific type
 */
export function asPaymentIntentEvent(event: Stripe.Event): StripePaymentIntentEvent | null {
    return isPaymentIntentEvent(event) ? event as StripePaymentIntentEvent : null;
}

export function asCheckoutSessionEvent(event: Stripe.Event): StripeCheckoutSessionEvent | null {
    return isCheckoutSessionEvent(event) ? event as StripeCheckoutSessionEvent : null;
}

export function asSubscriptionEvent(event: Stripe.Event): StripeSubscriptionEvent | null {
    return isSubscriptionEvent(event) ? event as StripeSubscriptionEvent : null;
}

export function asInvoiceEvent(event: Stripe.Event): StripeInvoiceEvent | null {
    return isInvoiceEvent(event) ? event as StripeInvoiceEvent : null;
}

export function asCustomerEvent(event: Stripe.Event): StripeCustomerEvent | null {
    return isCustomerEvent(event) ? event as StripeCustomerEvent : null;
}

/**
 * Utility function to create a type-safe webhook handler
 */
export function createWebhookHandler<T extends Stripe.Event>(
    eventType: StripeEventType | StripeEventType[],
    handler: (event: T) => Promise<void> | void
) {
    return async (event: Stripe.Event) => {
        const eventTypes = Array.isArray(eventType) ? eventType : [eventType];
        if (eventTypes.includes(event.type as StripeEventType)) {
            await handler(event as T);
        }
    };
}

/**
 * Helper to build a full webhook handler with multiple event handlers
 */
export function createStripeWebhookHandler(handlers: Array<{
    events: StripeEventType | StripeEventType[];
    handler: (event: Stripe.Event) => Promise<void> | void;
}>) {
    return async (event: Stripe.Event) => {
        for (const {events, handler} of handlers) {
            const eventTypes = Array.isArray(events) ? events : [events];
            if (eventTypes.includes(event.type as StripeEventType)) {
                await handler(event);
                return;
            }
        }
    };
}
