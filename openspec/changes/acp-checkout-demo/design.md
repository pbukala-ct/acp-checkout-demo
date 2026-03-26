## Context

The ACP Checkout Demo App replaces a Postman collection as the primary demo artefact for the Agentic Checkout Protocol. It must convince two distinct audiences simultaneously: business stakeholders who need to see a realistic ChatGPT-style UX, and technical stakeholders who need to see real API calls and responses.

The project already contains `lib/ct/` modules (client, auth, search) for commercetools access and a `package.json` indicating a Next.js stack. The `.env` file provides credentials for commercetools (`int-johnlewis-agentic` project) and the ACP connector service. A Stripe test secret key is needed for payment token generation.

The app is a single-developer, fast-build project with no production requirements — no uptime SLA, no concurrent users, no PII storage.

## Goals / Non-Goals

**Goals:**
- Full end-to-end ACP checkout flow runnable in a single uninterrupted demo session
- ChatGPT-style chat UI that business stakeholders find self-explanatory
- Real-time API payload panel for technical stakeholder transparency
- Automated Stripe test token injection — no manual steps required during the demo
- Product data sourced from live commercetools project with seed-data fallback
- App boots and runs from `.env` configuration alone

**Non-Goals:**
- Production-grade security, performance, or availability
- Real payment processing or PCI compliance
- User authentication, persistent sessions, or databases
- Multi-user / concurrent demo support
- Full catalogue search, faceting, or filtering
- LLM-generated agent responses (scripted dialogue only)
- WCAG accessibility compliance

## Decisions

### 1. Next.js App Router with React Server Components + Client Components

**Decision:** Use Next.js (already in the project) with a hybrid approach — server components fetch commercetools data, client components manage chat state and streaming UI.

**Alternatives considered:**
- Pure client-side SPA: simpler but loses server-side CT data fetching and credential protection
- Separate backend + frontend: adds infrastructure complexity with no benefit for a single-developer build

**Rationale:** Next.js API routes provide a secure proxy for ACP and Stripe calls (keeps secrets server-side). The existing `lib/ct/` code integrates without modification.

---

### 2. Scripted agent dialogue (no LLM)

**Decision:** Agent messages are pre-written strings rendered with a typing animation. No LLM API is called.

**Alternatives considered:**
- Claude / GPT API for live responses: adds latency, unpredictability, and cost; risks hallucination mid-demo
- Pre-recorded video: cannot respond to audience questions or be rerun interactively

**Rationale:** The demo must be deterministic and work without internet access to an LLM. The "magic" is the API chain, not the chat intelligence.

---

### 3. Stripe token generated at app startup, reused per session

**Decision:** On server startup (or first request), call `POST /v1/test_helpers/shared_payment/granted_tokens` once and cache the token in-memory. Display a token validity indicator in the UI.

**Alternatives considered:**
- Generate per demo session: adds latency and a possible failure point at the most critical demo moment
- Manual `curl` by presenter: adds a manual step that can fail live

**Rationale:** Test token validity window (expires 2026-06-09 based on `expires_at=1775847620`) covers many demo runs. Startup generation removes all runtime risk.

---

### 4. Collapsible side panel (not a separate route)

**Decision:** API payloads display in a right-hand collapsible panel on the same screen as the chat.

**Alternatives considered:**
- Separate `/debug` route: breaks narrative flow — presenter must navigate away
- Always-visible panel: clutters mobile/small-screen viewports; distracts business audience

**Rationale:** A collapsible panel lets the presenter toggle technical depth without interrupting the chat story. Default state: collapsed for business demos, open for technical demos.

---

### 5. Reuse existing `lib/ct/` modules

**Decision:** Import and use `lib/ct/client.ts`, `lib/ct/auth.ts`, and `lib/ct/search.ts` as-is for product fetching.

**Alternatives considered:**
- Rewrite: wastes time; existing code already handles auth token refresh
- Hardcode all products: loses the "real data" credibility of the demo

**Rationale:** The existing code is tested against the CT API. Reuse cuts build time significantly. If incompatibilities are found, wrap (don't rewrite) the affected modules.

---

### 6. All external API calls proxied through Next.js API routes

**Decision:** Browser never calls ACP or Stripe directly. All external calls go through `/api/` routes that read credentials from `process.env`.

**Alternatives considered:**
- Direct browser calls: exposes secrets in client bundle; violates basic security hygiene

**Rationale:** Non-negotiable. Credentials must never appear in browser network traffic, even in a demo app.

## Risks / Trade-offs

- **ACP `/complete` may reject Stripe token format** → Validate in Phase 1 before building any UI. If incompatible, stub the complete response with a static 201 mock.
- **commercetools product data may be sparse or malformed** → Implement seed-data fallback triggered automatically if fewer than 3 products return with name + price + image.
- **Stripe test key may be shared/exposed** → Load from `STRIPE_TEST_KEY` env var only; add `.env` to `.gitignore`; rotate before first external demo.
- **Scripted dialogue may feel robotic** → Write agent messages in natural, conversational English with realistic hesitation language ("Let me check that for you...").
- **Demo fails live if ACP service is unreachable** → Add a startup health check that polls `ACP_SERVICE_HOST` and displays a prominent warning banner if unreachable.

## Open Questions

- Does the ACP `/complete` endpoint accept the `shared_payment/granted_tokens` Stripe token type directly, or does it require a different token format? (Must resolve in Phase 1.)
- Should completed demo sessions be logged to a file for post-demo debugging? (Low priority; implement in Phase 3 if time allows.)
- Are there specific products in the `int-johnlewis-agentic` CT project that should always appear, or is random selection acceptable?
