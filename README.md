# AI Hub App — ACP Checkout Demo

A Next.js e-commerce demo showcasing the **Agentic Checkout Protocol (ACP)** integration with commercetools. Features a conversational AI shopping assistant that guides users through product browsing, selection, and checkout with real-time Stripe payment processing.

## Overview

The app simulates an agentic checkout experience through a chat-based UI. A user interacts with an AI assistant that drives them through a structured flow — from browsing a product catalog to completing a purchase — while an API inspector panel shows every ACP and Stripe call in real time.

### Checkout Flow

```
LOADING → BROWSING → COLLECTING_ADDRESS → CREATING_SESSION
       → SELECTING_SHIPPING → UPDATING_SESSION → REVIEWING_CART
       → COMPLETING → CONFIRMED
```

Error states trigger automatic ACP session cancellation to prevent orphaned frozen carts, and display targeted recovery messages.

## Features

- **Conversational checkout UI** — all interactions rendered as a chat thread with typed message components (products, address form, shipping options, cart summary, confirmation)
- **Product tile hover** — rich overlay with description, SKU badge, and "Buy now" button; clicking initiates checkout directly without a separate selection step
- **Inline product detail card** — injected into the chat thread when a product is selected, showing image, name, price, description, and SKU
- **ACP session management** — creates, updates, and cancels sessions via commercetools ACP connector; auto-cancels on error
- **Stripe token lifecycle** — caches test tokens with expiry awareness (60-second safety buffer); single-use tokens cleared after each completion attempt
- **Frozen cart recovery** — detects "frozen cart" / "invalid state" errors and surfaces a targeted reset message
- **API inspector panel** — built-in logger showing every ACP and Stripe request/response for debugging

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5, Tailwind CSS 4 |
| Commerce | commercetools SDK 8 |
| Payments | Stripe (test mode) |
| Auth | Jose (JWT), bcryptjs |
| Data fetching | SWR |
| i18n | next-intl |
| Testing | Vitest |
| Deployment | Netlify |

## Getting Started

### Prerequisites

- Node.js 18+
- A commercetools project with the ACP connector installed
- Stripe test mode credentials

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```env
# commercetools
CTP_PROJECT_KEY=
CTP_CLIENT_SECRET=
CTP_CLIENT_ID=
CTP_AUTH_URL=
CTP_API_URL=
CTP_SCOPES=

# ACP connector
ACP_SERVICE_HOST=

# Stripe (test mode)
STRIPE_TEST_KEY=
```

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start the demo.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── page.tsx                  # Main page — flow state machine & orchestration
├── layout.tsx
└── api/
    ├── acp/sessions/         # ACP session create / update / complete / cancel
    ├── stripe/token/         # Stripe token generation & status
    ├── products/             # Product catalog endpoint
    └── config/               # Exposes CTP_PROJECT_KEY safely

components/
├── ChatThread.tsx            # Message renderer (7 message types)
├── ProductCard.tsx           # Product tile with hover overlay
├── AddressForm.tsx
├── ShippingOptions.tsx
├── CartSummary.tsx
├── OrderConfirmation.tsx
├── ApiPanel.tsx / ApiEntry.tsx  # API inspector
└── ...

lib/
├── stripe-token.ts           # Token cache with expiry tracking
├── seed-products.ts          # Demo product catalog (5 products)
├── fulfillment.ts
├── acp-token.ts
└── ct/                       # commercetools SDK helpers

hooks/                        # SWR-based data hooks (cart, orders, payments, …)
openspec/                     # Product specs and change proposals
```

## OpenSpec Specifications

Product requirements are tracked under `openspec/`:

| Spec | Status | Description |
|---|---|---|
| `product-tile-hover` | Implemented | Hover overlay with description, SKU, and Buy now button |
| `inline-product-detail` | Implemented | Product detail card injected into chat thread |
| `stripe-token-expiry` | Implemented | Token cache with `expires_at` awareness |
| `session-auto-cancel-on-error` | Implemented | Fire-and-forget ACP cancel when checkout fails |

## Demo Product Catalog

The demo is seeded with 5 products (bath towel, kettle, cushion, lamp, duvet) priced in USD. Products are served from `lib/seed-products.ts` via the `/api/products` route.

## Error Handling

| Error | Behavior |
|---|---|
| Stripe token expired | Auto-refetched before completion attempt |
| Frozen cart / invalid state | Targeted recovery message + Reset prompt |
| Any ACP session failure | Best-effort cancel to free the cart, then ERROR state |
| Shipping update failure | Session cancelled; user prompted to restart |

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run lint      # ESLint
npm run test      # Vitest unit tests
```

## Deployment

The project is configured for Netlify via `@netlify/plugin-nextjs`. Set the same environment variables in your Netlify site settings. `CTP_PROJECT_KEY` is served through `/api/config` rather than being exposed in the client bundle.
