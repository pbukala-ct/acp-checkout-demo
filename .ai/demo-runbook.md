# ACP Checkout Demo — Presenter Runbook

## Setup

1. Copy `.env.example` to `.env` and fill in all values (CT credentials, `ACP_SERVICE_HOST`, `STRIPE_TEST_KEY`).
2. Run `npm install` then `npm run dev` — the app starts at `http://localhost:3000`.
3. Confirm the header shows **"Payment ready"** (green dot) before starting the demo.

## Running the demo

The flow is automatic once started:

1. **Products load** — 3–6 products appear from commercetools (or demo data if CT is unavailable).
2. **Select a product** — click any card; the agent confirms the selection.
3. **Click "Buy now"** — the agent asks for a shipping address.
4. **Fill in the address form** — use fictional test data; click "Confirm Address".
5. **Watch the agent** — it creates an ACP session, then automatically completes checkout with the Stripe test token.
6. **Order confirmation** appears in the chat.

## API panel

Click the **API** tab on the right edge to expand the inspector panel. Every ACP call (create session, complete session) appears here in real time with full request/response JSON — ideal for the technical audience.

## Resetting between runs

Click **↺ Reset** in the header. This cancels the active session, clears all state, and reloads fresh products — ready for the next run immediately.
