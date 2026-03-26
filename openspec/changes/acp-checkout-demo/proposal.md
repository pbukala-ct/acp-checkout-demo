## Why

Presales engineers currently demo the Agentic Checkout Protocol (ACP) using a raw Postman collection — a tool invisible to business stakeholders and requiring manual step-by-step execution that kills narrative flow. A ChatGPT-style demo app backed by real commercetools and Stripe APIs will replace this, giving consultants a single tool that serves both business and technical audiences simultaneously.

## What Changes

- **NEW**: Chat-style UI simulating an AI agent guiding the user through product discovery and checkout
- **NEW**: Product browsing sourced from the `int-johnlewis-agentic` commercetools project, displayed as chat cards
- **NEW**: Conversational address collection flow before checkout initiation
- **NEW**: Full ACP checkout session lifecycle — create → update → complete — via the configured ACP connector service
- **NEW**: Automated Stripe test token generation injected into the complete-session call
- **NEW**: Collapsible API payload side panel showing every ACP request/response in real time
- **NEW**: Order confirmation screen rendered in the chat thread

## Capabilities

### New Capabilities

- `product-discovery`: Browse and select products from commercetools; display product cards in the chat thread with name, image, and price
- `agent-checkout-flow`: Conversational agent UI that collects shipping address and drives the user through the checkout journey step by step
- `acp-session-management`: Create, update, and complete ACP checkout sessions via the connector service REST API
- `stripe-token-integration`: Generate a Stripe test payment token at startup and inject it automatically into the complete-session API call
- `api-debug-panel`: Collapsible side panel showing real-time ACP API request and response payloads for technical audience transparency
- `order-confirmation`: Display a human-readable order confirmation in the chat thread upon successful checkout completion

### Modified Capabilities

## Impact

- **APIs integrated**: commercetools Products API (`int-johnlewis-agentic` project), ACP connector service (`ACP_SERVICE_HOST`), Stripe test helpers API
- **Environment variables**: `CTP_PROJECT_KEY`, `CTP_CLIENT_ID`, `CTP_CLIENT_SECRET`, `CTP_AUTH_URL`, `CTP_API_URL`, `CTP_SCOPES`, `ACP_SERVICE_HOST`, `STRIPE_TEST_KEY`
- **Existing code reused**: `lib/ct/client.ts`, `lib/ct/auth.ts`, `lib/ct/search.ts` for commercetools integration
- **No existing capabilities modified** — this is a net-new demo application
- **No production data or real payments** — Stripe test credentials only; all buyer data is fictional
