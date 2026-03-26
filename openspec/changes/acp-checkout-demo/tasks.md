## 1. Phase 1 — API Chain Validation

- [x] 1.1 Add `STRIPE_TEST_KEY` to `.env` and `.env.example`; confirm `.env` is in `.gitignore`
- [x] 1.2 Create `app/api/stripe/token/route.ts` — server-side route that calls Stripe test helpers endpoint and returns the generated token
- [ ] 1.3 Verify Stripe token generation works end-to-end (token returned, no auth errors)
- [x] 1.4 Create `app/api/acp/sessions/route.ts` — POST handler that calls `ACP_SERVICE_HOST/checkout_sessions` and returns the session ID
- [x] 1.5 Create `app/api/acp/sessions/[id]/complete/route.ts` — POST handler that calls `ACP_SERVICE_HOST/checkout_sessions/{id}/complete` with Stripe token injected from server-side cache
- [ ] 1.6 Write a manual test script (or use curl) to call all three routes in sequence and confirm 201 response on complete
- [ ] 1.7 Resolve open question: confirm ACP `/complete` accepts the `shared_payment/granted_tokens` token format; if not, determine correct token type

## 2. Environment and Project Setup

- [x] 2.1 Add `ACP_SERVICE_HOST` and `STRIPE_TEST_KEY` to `.env.example` with placeholder values and comments
- [x] 2.2 Create a startup health-check utility that verifies `ACP_SERVICE_HOST` is reachable on first request and logs a warning if not
- [ ] 2.3 Confirm `lib/ct/client.ts` and `lib/ct/auth.ts` work with the `int-johnlewis-agentic` project credentials
- [ ] 2.4 Confirm `lib/ct/search.ts` can return products with name, price, and image from the project

## 3. Product Discovery

- [x] 3.1 Create `app/api/products/route.ts` — server route that fetches 3–6 random products from commercetools using existing `lib/ct/search.ts`
- [x] 3.2 Define seed product data (3–5 hardcoded products with name, image, price) as a fallback constant in `lib/seed-products.ts`
- [x] 3.3 Add fallback logic: if CT returns fewer than 3 valid products, return seed data with a `isDemoData: true` flag
- [x] 3.4 Build `ProductCard` component — displays product name, image, price; shows `[DEMO DATA]` badge when `isDemoData` is true

## 4. Chat UI Shell

- [x] 4.1 Create the main demo page at `app/page.tsx` with a two-column layout: chat thread (left/main) + collapsible API panel (right)
- [x] 4.2 Build `ChatThread` component — scrollable message list supporting agent messages, user messages, and embedded components (product cards, forms)
- [x] 4.3 Build `AgentMessage` component — renders agent text with a simulated typing animation (300–800ms delay before text appears)
- [x] 4.4 Build `ApiPanel` component — collapsible right panel with toggle button; default state collapsed; renders a scrollable list of `ApiEntry` items
- [x] 4.5 Build `ApiEntry` component — shows method, URL, status code, pretty-printed request JSON, and pretty-printed response JSON; error entries use distinct colour
- [x] 4.6 Add panel state wiring: every ACP API call appends an entry to a shared `apiLog` state visible in `ApiPanel`

## 5. Agent Checkout Flow

- [x] 5.1 Define the agent dialogue script as a typed constant: product browse intro, product selected, buy prompt, address request, session creating, session created, completing, confirmed, error states
- [x] 5.2 Implement agent flow state machine: `BROWSING → PRODUCT_SELECTED → COLLECTING_ADDRESS → CREATING_SESSION → COMPLETING → CONFIRMED | ERROR`
- [x] 5.3 Build `AddressForm` component — renders inside the chat thread; fields: first name, last name, email, phone, line_one, line_two, city, postal_code, country; inline validation on submit
- [x] 5.4 Wire Buy button to trigger address collection state
- [x] 5.5 Wire address form submission to trigger ACP session creation
- [x] 5.6 Add Reset button to chat header; on click: cancel active session (if any), clear state, re-fetch products

## 6. ACP Session Management API Routes

- [x] 6.1 Create `app/api/acp/sessions/[id]/route.ts` — POST handler for update session
- [x] 6.2 Create `app/api/acp/sessions/[id]/cancel/route.ts` — POST handler for cancel session
- [x] 6.3 Create `app/api/acp/sessions/[id]/route.ts` GET handler for get session status
- [x] 6.4 Ensure all ACP routes append request/response data to a server-side log returned to the client for the API panel

## 7. Stripe Token Integration

- [x] 7.1 Create server-side token cache module `lib/stripe-token.ts` — generates token on first call, caches result, exports `getStripeToken()` and `getTokenStatus()`
- [x] 7.2 Create `app/api/stripe/token/status/route.ts` — GET route returning token validity status for the UI indicator
- [x] 7.3 Add token readiness indicator to the chat header (e.g., green dot = ready, red = unavailable)
- [x] 7.4 Wire `getStripeToken()` into the complete session API route so the token is injected automatically

## 8. Order Confirmation

- [x] 8.1 Build `OrderConfirmation` component — renders in the chat thread with distinct success styling (green accent, checkmark); shows session ID as order reference and product name
- [x] 8.2 Wire `OrderConfirmation` to render when the complete API call returns 201
- [x] 8.3 Ensure no further checkout steps auto-trigger after confirmation; Reset control remains available

## 9. Polish and Rehearsal

- [ ] 9.1 Run 5 consecutive end-to-end demo flows internally; fix any failures before external use
- [ ] 9.2 Test with API panel open (technical audience mode) and closed (business audience mode)
- [ ] 9.3 Verify all secrets are server-side only (inspect browser network tab — no CT or Stripe credentials visible)
- [ ] 9.4 Add `[DEMO DATA]` badge display verification when seed fallback is triggered
- [x] 9.5 Write a one-paragraph presenter guide in `.ai/demo-runbook.md` covering: env setup, how to start the app, how to toggle the API panel, how to reset between runs
