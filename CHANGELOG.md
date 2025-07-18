# Changelog

All notable changes to this project will be documented in this file.

## [0.5.0] - 2025-07-18

### Added
- `useStripeWebhook` hook to handle Stripe webhook events with proper type safety.
- Comprehensive webhook utility functions in `stripeWebhooks.ts` including:
  - `StripeEventType` enum with all major Stripe webhook event types
  - Type guard functions (e.g., `isPaymentIntentEvent`, `isSubscriptionEvent`)
  - Type casting helpers for easier event handling
  - Webhook handler creator functions for type-safe event processing
- Added `WebhookDemo` component to demonstrate webhook handling in the example app.
- Example Netlify function for webhook event processing.

## [0.4.0] - 2025-07-15

### Added
- `useStripeInvoices` hook to fetch a customer's invoice history from the Stripe API.
- `InvoicesDemo` component to showcase the new hook's functionality.

### Changed
- Refactored the entire demo application into separate, well-documented components (`SetupGuide`, `CheckoutDemo`, `SubscriptionDemo`).
- Completely redesigned the demo UI with a modern, two-column layout and a new stylesheet (`Demo.css`).
- Added a custom SVG favicon to the demo application.

## [0.3.1] and earlier
- Initial release with `useStripeCheckout` and `useStripeSubscription` hooks.
