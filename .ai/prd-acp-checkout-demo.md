# PRD — ACP Checkout Demo App

## Section 1 — Document Header

| Field | Value |
|---|---|
| Product / Feature Name | Agentic Checkout Protocol (ACP) Demo App |
| Author | AI-generated draft |
| Date | 2026-03-26 |
| Status | Draft |
| Version | 0.1 |
| Confidence Level | Medium |
| Elevator Pitch | A ChatGPT-style demo app that walks a user through an AI-agent-driven product discovery and checkout flow — backed by real commercetools and Stripe APIs — so presales teams can replace raw Postman demos with a compelling, dual-audience story. |

---

## Section 2 — Problem Hypothesis

> We believe that **presales engineers and consultants** experience **a credibility and clarity gap** when trying to **demonstrate the Agentic Checkout Protocol (ACP) to prospective customers and partners**. This causes **decision-makers to fail to understand how agentic commerce would work in practice**, reducing conversion rates and slowing deal velocity. We know this problem is real because **the only existing demo artefact is a Postman collection — a tool invisible to business stakeholders and requiring manual step-by-step execution that kills narrative flow**.

- **Severity rating**: Significant — losing a deal or delaying partner sign-off due to a weak demo is a direct and measurable revenue impact.
- **Frequency vs. acuity**: Moderate frequency (every presales engagement where ACP is relevant) with high acuity per occurrence — each failed demo is a real commercial opportunity at risk.
- **Cost of inaction**: Worsens over time. As agentic commerce becomes a more prominent buying criterion, the gap between competitors with polished demos and teams relying on Postman grows.
- **Supporting evidence**: [ASSUMPTION] — No quantitative conversion data captured from existing Postman demos. Signal is qualitative: the Postman collection exists as the only demo tool, indicating no purpose-built demo has been built before.

---

## Section 3 — Riskiest Assumptions

| Assumption | Confidence | How to test it | Kill threshold |
|---|---|---|---|
| The ACP checkout API (`/checkout_sessions`, `/complete`) works end-to-end against the live `chatgpt-acp-connector-service-host` | Low–Medium | Run the Postman collection fully against the configured host; verify a 201 response on the complete endpoint | If the complete checkout call consistently fails and the service owner cannot fix it, the entire demo collapses |
| The Stripe `shared_payment/granted_tokens` test endpoint returns a usable token that the ACP service accepts as `payment_data.token` | Medium | Execute the `curl` command with the provided Stripe test key and pass the result token to the complete session call | If the ACP service rejects the Stripe token format or the Stripe test endpoint is unavailable, payment flow must be mocked statically |
| Random commercetools products in project `pb-demo-jan26` are well-structured enough to display meaningfully in a product-browse chat UI | Medium | Query `GET /pb-demo-jan26/products` and inspect data quality (name, image, price) | If fewer than 5 products have valid name + price + image, product discovery must fall back to hardcoded seed data |
| Business-audience stakeholders will find the ChatGPT-style UX sufficiently intuitive to follow during a live demo | Medium | [ASSUMPTION] — Run the demo with one non-technical stakeholder observer and note where comprehension breaks down | If observers cannot follow the agent flow without a running commentary, the UX requires a narrated overlay |
| A single developer can build a functional demo in the time available | Medium | [OPEN QUESTION] — No explicit deadline was given; confirm timeline with the team | If the build takes significantly longer than one sprint, scope must be cut to a static UI with pre-recorded API responses |

---

## Section 4 — Who We Are Building For

### Primary Persona — The Presales Engineer

**Who they are:** A technically fluent consultant or solutions engineer who runs discovery sessions and demos for enterprise prospects. They are comfortable with APIs but spend their demo time trying to tell a business story, not explain JSON payloads.

**Job-to-be-done:** When I am presenting ACP to a prospective customer or partner, I want to show a seamless, end-to-end agentic checkout flow in a realistic UI, so I can make the abstract concept of "AI-driven checkout" concrete and believable without needing the audience to read raw HTTP responses.

**Current workaround:** Running the Postman collection step by step, narrating each request while toggling between tabs. Business stakeholders lose interest; technical stakeholders ask about implementation details that Postman cannot illustrate.

**Quote when the workaround fails:**
> "I had to talk them through every single request — 'now I'm creating the session, now I'm updating it' — and by the time we got to the payment step, half the room had tuned out. I needed something that just *looked* like it was working."

**How they will know it worked:** They can run the full demo flow in under 5 minutes, the business audience nods along with the chat UX, and the technical audience can see the actual API payloads in a side panel without breaking the narrative.

### Secondary Persona — The Technical Audience Member

A solutions architect or developer at the prospect/partner organisation who watches the demo and wants to understand the underlying API mechanics — what calls are made, in what order, with what payloads — so they can assess integration effort.

**Job-to-be-done:** When I watch an ACP demo, I want to see the actual API calls and responses alongside the UI, so I can judge whether this is something my team could integrate with our existing stack.

### Who We Are NOT Building For

This is not a production checkout application, a customer-facing product, or a load-tested service. We are not building for end consumers, not building for a multi-tenant SaaS offering, and not building for a scenario where multiple demos run simultaneously. Any feature that adds complexity without serving the presales demo scenario is out of scope.

---

## Section 5 — Pain Points and Unmet Needs

**Pain 1: Postman is invisible to business stakeholders**
> "My CTO got it. My CMO just stared at the screen like I was speaking another language. I need something that looks like an actual product."
**Severity:** High — directly undermines demo effectiveness for the buying committee.
**Current state:** Unaddressed. Postman has no business-readable presentation layer.

**Pain 2: No narrative flow — each API call breaks immersion**
> "You have to manually trigger each step, so there's this awkward pause while you switch tabs and type. It doesn't feel like an agent, it feels like me pretending to be one."
**Severity:** High — destroys the "agentic" illusion that is the entire point of the demo.
**Current state:** Unaddressed. Postman requires manual execution of each step.

**Pain 3: Technical context is all-or-nothing**
> "Either I show the API payloads and lose the business people, or I hide them and the developers don't believe me."
**Severity:** Medium — presales engineers must currently choose one audience or the other.
**Current state:** No dual-pane view exists. Postman forces a single view.

**Pain 4: Stripe payment integration is untested in demo context**
> "I've never actually validated the full flow end-to-end with a real Stripe token — I always skip that step because the setup is fiddly."
**Severity:** High — if the payment step fails live, the demo fails entirely.
**Current state:** Stripe token generation is manual (`curl`); it has not been integrated into any demo flow.

**Pain 5: Product data requires manual setup**
> "I have to pre-configure which products to show, otherwise you end up with half-built catalogue entries that look embarrassing."
**Severity:** Medium — random product pull from commercetools risks low-quality data appearing in the demo.
**Current state:** No product filtering or seed-data fallback exists.

---

## Section 6 — Solution Hypotheses

**Hypothesis 1 — Conversational agent UI**
> We believe that **building a ChatGPT-style chat interface that simulates an AI agent driving the checkout conversation** will result in **business stakeholders immediately understanding the ACP concept** for **presales engineers running demos**. We will know this is true when **a non-technical observer can describe the agent's role in the checkout flow without prompting after watching the demo**.

- **Minimum version:** A static chat UI with hardcoded conversational steps, product cards, and address collection form — no live API calls.
- **Full version:** Live agent responses driven by real commercetools product data and ACP API calls, with animated message streaming.
- **Why minimum first:** If the UX narrative fails, the API integration is irrelevant. Validate the story before wiring up the backend.

**Hypothesis 2 — Dual-pane technical transparency**
> We believe that **showing real API request/response payloads in a collapsible side panel alongside the chat UI** will result in **technical audience members gaining enough confidence in the integration to endorse the solution** for **developer and architect observers**. We will know this is true when **a technical stakeholder asks a follow-up integration question (rather than questioning whether the demo is real)**.

- **Minimum version:** A collapsible JSON panel that shows the payload for each ACP API call as it executes.
- **Full version:** Colour-coded, annotated payloads with links to API documentation.
- **Why minimum first:** Raw JSON is sufficient for a technical audience; annotation adds polish but not signal.

**Hypothesis 3 — Automated Stripe token + end-to-end checkout**
> We believe that **automating Stripe test token generation and injecting it into the ACP complete-session call** will result in **a demo that reaches order confirmation without manual intervention** for **the presales engineer**. We will know this is true when **the demo completes a full checkout cycle — from product browse to order confirmation — in a single uninterrupted flow**.

- **Minimum version:** Pre-generate a Stripe test token at app startup and use it for every demo session (valid for the configured `expires_at`).
- **Full version:** Generate a fresh Stripe token per demo session on demand.
- **Why minimum first:** Token generation at startup removes runtime risk; a pre-generated token is sufficient for demo purposes.

---

## Section 7 — Desired Outcomes

| User Outcome | Leading Indicator | Lagging Indicator |
|---|---|---|
| Presales engineer can run the full ACP demo without switching tools or manual API execution | Demo completes end-to-end without a context switch in the first run-through | Reduction in demo preparation time per engagement |
| Business stakeholders understand the agent-driven checkout concept after watching the demo | Observer can answer "what did the agent do?" without prompting | Increase in ACP-related follow-up questions from business-side participants |
| Technical stakeholders trust the demo is backed by real APIs | Technical observers ask integration questions, not "is this fake?" questions | Increase in ACP proof-of-concept requests following demos |
| The checkout completes successfully in every demo run | Zero checkout failures during internal test runs | Zero demo failures reported by presales team |
| Presales engineers adopt the demo app over Postman for ACP demos | Demo app used in next 3 presales engagements | Postman collection retired from active demo use |

---

## Section 8 — Functional Requirements

| ID | Title | Description | Priority | Persona(s) |
|---|---|---|---|---|
| FR-001 | Product discovery from commercetools | On load, fetch a random selection of products from the `pb-demo-jan26` commercetools project and display them as chat cards | Must Have | Presales Engineer |
| FR-002 | Product detail view in chat | User can select a product and see its name, image, price, and description rendered in the chat thread | Must Have | Presales Engineer, Technical Audience |
| FR-003 | Agent address collection | After user clicks "Buy", the agent prompts for shipping address via a structured form or conversational message sequence | Must Have | Presales Engineer |
| FR-004 | Create ACP checkout session | App calls `POST /checkout_sessions` with buyer details, selected product, and fulfillment address; displays the session ID and response payload | Must Have | Presales Engineer, Technical Audience |
| FR-005 | Stripe test token generation | On demo start (or on demand), app calls `POST https://api.stripe.com/v1/test_helpers/shared_payment/granted_tokens` with the configured Stripe test key and stores the resulting token | Must Have | Presales Engineer |
| FR-006 | Complete ACP checkout session | App calls `POST /checkout_sessions/{id}/complete` with the Stripe token and buyer billing address; displays the response | Must Have | Presales Engineer, Technical Audience |
| FR-007 | API payload side panel | A collapsible panel shows the raw JSON request and response for every ACP API call made during the session | Must Have | Technical Audience |
| FR-008 | Order confirmation screen | On successful completion, the chat displays a human-readable order confirmation message with order ID | Must Have | Presales Engineer |
| FR-009 | Update checkout session | App can call `POST /checkout_sessions/{id}` to update fulfillment option or buyer details before completing | Should Have | Technical Audience |
| FR-010 | Cancel checkout session | App can call `POST /checkout_sessions/{id}/cancel` and reflect cancellation in the chat thread | Should Have | Presales Engineer, Technical Audience |
| FR-011 | Reset / new demo flow | A "Reset" button clears the session and returns to the product browse state for a fresh demo run | Should Have | Presales Engineer |
| FR-012 | Get checkout session status | Display current session state retrieved via `GET /checkout_sessions/{id}` at any point during the flow | Could Have | Technical Audience |
| FR-013 | Webhook event display | Show the `Send Order Event` webhook payload when an order is confirmed | Could Have | Technical Audience |
| FR-014 | Multi-language UI | Support additional languages beyond English | Won't Have | — |
| FR-015 | User authentication / accounts | Login, user profiles, or saved addresses | Won't Have | — |

### Acceptance Criteria

**FR-001 — Product discovery from commercetools**
```
Given the app has loaded and the commercetools credentials are present in .env
When the chat interface initialises
Then the app fetches products from the pb-demo-jan26 project
And displays between 3 and 6 product cards in the chat thread
And each card shows at minimum a product name and price
```

```
Given the commercetools API returns fewer than 3 products with complete data
When the app initialises
Then the app falls back to a set of hardcoded seed products
And displays a [DEMO DATA] label on each seed card
```

```
Given the products have been fetched
When the user views the chat
Then each product card is selectable with a single click or tap
```

**FR-004 — Create ACP checkout session**
```
Given the user has selected a product and submitted a shipping address
When the agent initiates the checkout session
Then the app calls POST /checkout_sessions with buyer, items, and fulfillment_address
And the request body is displayed in the API panel
And the response (including checkout-session-id) is displayed in the API panel
And the chat confirms the session was created with the session ID
```

```
Given the POST /checkout_sessions call returns a non-201 status
When the error is received
Then the chat displays a human-readable error message
And the API panel shows the full error response body
And the demo does not proceed to the complete step
```

**FR-005 — Stripe test token generation**
```
Given the Stripe test secret key is configured in .env or hardcoded as a constant
When the app initialises (or when the user triggers token generation)
Then the app calls POST https://api.stripe.com/v1/test_helpers/shared_payment/granted_tokens
And stores the returned token in application state
And displays a token readiness indicator in the UI
```

```
Given a valid Stripe token has been generated
When the complete checkout session step is reached
Then the token is automatically injected into the payment_data.token field
Without requiring manual copy-paste by the presenter
```

**FR-006 — Complete ACP checkout session**
```
Given a valid checkout session ID and a valid Stripe token exist in application state
When the agent triggers the complete step
Then the app calls POST /checkout_sessions/{id}/complete with payment_data and buyer fields
And displays the full request payload in the API panel
And on 201 response, advances the chat to the order confirmation state
```

```
Given the complete call returns a non-201 response
When the error is received
Then the chat displays a clear failure message with the error reason
And the session is not marked as complete
```

**FR-007 — API payload side panel**
```
Given the user is on the chat screen
When any ACP API call is made
Then the API panel updates to show the endpoint URL, HTTP method, request body, and response body
And the panel is visible without scrolling (or accessible via a toggle)
And the JSON is formatted for readability (not minified)
```

---

## Section 9 — Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Each ACP API call must complete and update the UI within 5 seconds; Stripe token generation must complete within 3 seconds on a standard conference WiFi connection |
| Scalability | Single-session demo app; no concurrent session support required. No scalability target. |
| Availability | Local or hosted demo environment; no uptime SLA. App must start cleanly from `npm run dev` or equivalent with no manual pre-steps beyond `.env` configuration. |
| Security | Stripe test key and commercetools credentials must be loaded from `.env` only — never hardcoded in source or exposed in the browser console. The Stripe test key provided (`sk_test_51SwO...`) must not be committed to version control. |
| Privacy / Compliance | Demo only; no real PII is collected or stored. All buyer data used is fictional test data. No GDPR/CCPA obligations apply. |
| Accessibility | Not required for this demo — no WCAG target. |
| Internationalisation | English only. |
| Maintainability | No test coverage requirement. Code must be understandable by a single developer. `.env.example` file must document all required environment variables. |

---

## Section 10 — What We Are Not Building (and Why)

1. **A real payment processor integration.** Real card capture, PCI compliance, and production Stripe keys are not in scope. The demo uses Stripe test helpers exclusively. Including real payment handling would require security review, compliance overhead, and is unnecessary for a demo that only needs to show the API contract works.

2. **Persistent order storage or a database.** The demo does not persist checkout sessions, orders, or user data between runs. A database adds infrastructure complexity that serves no demo purpose — the ACP service and commercetools handle state during a session.

3. **A production-grade chat AI / LLM backend.** The agent behaviour is scripted/mocked. There is no LLM generating responses in real time. The demo simulates ChatGPT-style UX without the cost and latency of calling an actual LLM API during a live demo.

4. **Multi-user or concurrent session support.** The app supports one active demo session at a time. Multi-tenancy, session isolation, or concurrent presenter support are out of scope.

5. **A full product catalogue browser / search.** The app pulls a random product selection to kick off the conversation. Full faceted search, filtering, pagination, and category navigation — despite existing code in the repository — are not required for this demo scenario.

---

## Section 11 — Tradeoffs and Alternatives Considered

**Decision 1: Scripted agent vs. live LLM**
- **Decided:** Scripted, deterministic agent dialogue
- **Alternatives considered:** (a) Real-time Claude/GPT API calls for agent responses; (b) Pre-recorded screen recording
- **Why this path:** A scripted agent is fast to build, predictable in demos (no hallucinations mid-presentation), and works without internet access to an LLM API. The goal is to demonstrate ACP, not demonstrate LLM capabilities.
- **Risk:** The UX will feel slightly less "magical." Mitigate by writing dialogue that is natural and contextually appropriate.

**Decision 2: Pre-generate Stripe token at startup vs. per-session**
- **Decided:** Generate at app startup and reuse for all demo sessions
- **Alternatives considered:** (a) Require presenter to run `curl` manually before each demo; (b) Generate a fresh token per session on demand
- **Why this path:** Removes a manual step that could fail live. The test token has a configured `expires_at` (2026-03-26 is before the token's expiry of 1775847620 UNIX timestamp). A single startup token is sufficient for back-to-back demos.
- **Risk:** If the token expires mid-demo, checkout will fail. Mitigate by checking token validity on startup and displaying a warning if the token is close to expiry.

**Decision 3: Dual-pane layout vs. separate developer mode**
- **Decided:** Collapsible API panel within the same screen
- **Alternatives considered:** (a) A separate "developer view" route/toggle; (b) No technical panel at all
- **Why this path:** A collapsible panel lets the presenter show or hide technical detail without leaving the demo flow. A separate route breaks narrative continuity. No technical panel would exclude a key audience.
- **Risk:** Panel may clutter the UI on smaller screens. Mitigate by defaulting to collapsed on mobile-width viewports.

**Decision 4: Reuse existing commercetools library code vs. build from scratch**
- **Decided:** Reuse existing `lib/ct/` modules from the repository
- **Alternatives considered:** (a) Write new commercetools fetch logic; (b) Hardcode all product data statically
- **Why this path:** The repository already contains `lib/ct/client.ts`, `lib/ct/search.ts`, and auth handling. Reusing these cuts build time significantly and validates the existing code against the demo project.
- **Risk:** Existing code may have dependencies or assumptions incompatible with the demo context. Mitigate by reading each relevant module before integrating.

---

## Section 12 — MVP Definition

**The one thing:** If only one capability could ship, it would be FR-006 (complete ACP checkout session end-to-end). The entire value of the demo is showing that the full API chain works — product → session → payment → confirmation. Every other screen exists to give that moment narrative context.

**MVP scope:**
- FR-001 — Product discovery: Required to start the story with real data.
- FR-002 — Product detail in chat: Required to give the user something to "buy."
- FR-003 — Agent address collection: Required to satisfy the ACP session's `fulfillment_address` field.
- FR-004 — Create checkout session: The first critical API call; must be visible and working.
- FR-005 — Stripe token generation: Must be automated; a failing payment step kills the demo.
- FR-006 — Complete checkout session: The climax of the demo; the riskiest call.
- FR-007 — API payload panel: Required for technical credibility — without it, the demo cannot serve the technical audience.
- FR-008 — Order confirmation: Required to give the flow a clear endpoint.

**MVP exclusions:**
- FR-009 (update session), FR-010 (cancel), FR-011 (reset), FR-012 (get status), FR-013 (webhook display) — all add polish but none are required to validate the core checkout flow.

**Definition of done:**
- A presenter can open the app, select a product, enter an address, watch the agent call all three ACP endpoints in sequence with a real Stripe token, and reach a human-readable order confirmation — without any manual intervention or context-switching.
- All API calls and responses are visible in the side panel.
- The app runs from `.env` configuration with no hardcoded secrets in source.

---

## Section 13 — North Star Metric

**Metric:** Full end-to-end demo completion rate — the percentage of demo runs (from product selection to order confirmation) that complete without an error requiring manual intervention.

**Why this metric:** The single biggest risk is checkout failure. If the demo fails live, no amount of UI polish matters. This metric directly measures whether the riskiest assumption — that the ACP API chain works — is true.

**Targets:**
- **Before first demo use:** 100% completion rate across 5 consecutive internal test runs.
- **30 days:** 100% completion rate across all presales demo uses (target: zero live failures).
- **90 days:** [ASSUMPTION] Metric is retired or repurposed; by this point the demo is stable and the team should be tracking presales conversion uplift instead.

**Vanity metric risk:** Completion rate looks good if presenters skip the Stripe payment step and manually end the session. Ensure the metric counts only flows that reach the `/complete` endpoint with a real Stripe token.

---

## Section 14 — Experiment and Instrumentation Plan

**Hypothesis being tested:** Presales engineers who use the demo app instead of Postman can convey the ACP value proposition clearly enough that technical and business stakeholders both engage with follow-up questions.

**Experiment design:** Wizard-of-Oz + internal rehearsal. Run three internal demo rehearsals with a mixed audience (one technical, one non-technical observer per run) before the first external use. Gather qualitative feedback after each run.

**Sample:** Internal team members available for a 30-minute rehearsal session. Minimum: 2 rehearsal runs with at least one non-technical observer each.

**Duration:** Complete rehearsals before the first external presales engagement.

**Instrumentation (must be in place before first use):**
- Console log (or simple in-app log panel) for every ACP API call: endpoint, timestamp, HTTP status, latency in ms.
- Visual indicator in UI for each step state: pending / in-progress / success / error.
- Stripe token validity status shown on app load (valid / expired / not-generated).
- [OPEN QUESTION] Should API call logs be persisted to a file for post-demo review? Useful for debugging failures.

---

## Section 15 — Success and Failure Criteria

**Success — continue and invest more:**
- 5 consecutive internal test runs complete end-to-end without error.
- At least 2 presales engineers adopt the app as their default ACP demo tool within 30 days.
- At least one non-technical stakeholder observer describes the agent flow accurately without prompting after watching a demo.

**Failure — stop or pivot:**
- The ACP `/complete` endpoint fails consistently across environments (not just a configuration issue) after 3 debugging attempts — at this point the app must fall back to a mock/static response for the complete step.
- The Stripe test token API is unavailable or incompatible with the ACP service after 2 attempts to resolve — pre-bake a static test token as a fallback constant.
- Presales engineers revert to using Postman after the first external demo — investigate whether the failure was a technical issue or a UX issue before deciding to continue.

**Iteration triggers:**
- If checkout completes but order confirmation is unclear → iterate on confirmation UX before next demo.
- If technical observers ask "is this real?" → add explicit API endpoint labels and HTTP status codes to the panel.
- If business observers lose the thread → add an animated progress indicator showing where in the flow the agent is.

---

## Section 16 — Risks and Mitigations

| ID | Risk | Likelihood | Impact | Score | Mitigation | Contingency | Owner |
|---|---|---|---|---|---|---|---|
| R-001 | ACP `/complete` endpoint rejects Stripe token format or returns 4xx/5xx in live environment | H | H | 9 | Test the full API chain against the real host before any demo; validate Stripe token format against ACP service docs | Pre-bake a static success response for the complete step as a demo fallback | Developer |
| R-002 | `chatgpt-acp-connector-service-host` is not configured or unreachable at demo time | M | H | 6 | Document required `.env` variables in `.env.example`; add a startup health-check that fails loudly if the host is unreachable | Display a "service unavailable" banner and run in mock mode | Developer |
| R-003 | Stripe test key expires or is revoked before the demo | M | H | 6 | Store key in `.env`; add a token validity check on startup; document key renewal process | Pre-generate tokens and store them as environment variables with expiry dates | Developer |
| R-004 | commercetools product data in `pb-demo-jan26` is incomplete (missing names, prices, images) | M | M | 4 | Implement hardcoded seed product fallback triggered automatically if CT data is insufficient | Manually curate 3–5 products in the CT project with complete data before the first demo | Developer |
| R-005 | Single developer scope underestimated; demo not ready before first presales engagement | M | M | 4 | Scope strictly to MVP (FR-001 through FR-008); defer all Should Have and Could Have until after first successful demo | Use static mock responses for non-critical steps to ship a working skeleton faster | Developer |
| R-006 | Sensitive credentials (Stripe key, CT secret) accidentally committed to version control | L | H | 6 | Add `.env` to `.gitignore` immediately; add a pre-commit hook or CI check for secret patterns | Rotate credentials immediately if leaked; use environment variable injection instead | Developer |

---

## Section 17 — Dependencies and Integrations

| Dependency | What it provides | Exists or must be built | Risk if delayed |
|---|---|---|---|
| ACP connector service (`chatgpt-acp-connector-service-host`) | Checkout session lifecycle APIs: create, update, complete, cancel, get | Exists (external service, host URL configured via `.env`) | H — without this, no ACP demo is possible |
| commercetools project `pb-demo-jan26` | Product catalogue data; OAuth2 access tokens | Exists (credentials in `.env`) | M — fallback to seed data possible |
| Stripe test API (`api.stripe.com/v1/test_helpers`) | Generates test payment tokens for the complete session call | Exists (external API, test key provided) | H — without a valid token, checkout cannot complete |
| Existing `lib/ct/` library modules | commercetools client, auth, and product search | Exists in repository | L — can rewrite if needed |
| Node.js / Next.js runtime | Application framework | Exists (inferred from repository structure and `package.json`) | L |

---

## Section 18 — Timeline and Phases

### Phase 1 — Foundation (API Chain Validation)
**Goal:** Prove the full ACP API chain works end-to-end from code before building any UI.
**Scope:** FR-004, FR-005, FR-006 — implemented as server-side scripts or API route tests.
**Exit criteria:** A single script runs all three ACP calls in sequence (create → complete with Stripe token) and returns a 201 on the complete call.
**Estimated duration:** 1–2 days.

### Phase 2 — MVP Chat UI
**Goal:** Build the minimum chat interface that walks through the demo flow.
**Scope:** FR-001, FR-002, FR-003, FR-007, FR-008.
**Exit criteria:** A presenter can run the full flow from product browse to order confirmation with the API panel visible and all calls succeeding.
**Estimated duration:** 2–3 days.

### Phase 3 — Polish and Rehearsal
**Goal:** Fix issues found in internal rehearsal runs; add Should Have features.
**Scope:** FR-009, FR-010, FR-011; UX refinements based on rehearsal feedback.
**Exit criteria:** 5 consecutive successful demo runs by at least 2 different presenters.
**Estimated duration:** 1–2 days.

| Phase | Duration | Key Deliverable | Exit Criteria |
|---|---|---|---|
| 1 — API Chain Validation | 1–2 days | Working end-to-end API script | 201 on `/complete` with real Stripe token |
| 2 — MVP Chat UI | 2–3 days | Runnable demo app | Full flow from product to confirmation |
| 3 — Polish and Rehearsal | 1–2 days | Demo-ready app | 5 consecutive clean runs |

**Total estimated build time: 4–7 days (single developer)**

---

## Section 19 — What Does Success Look Like in 6 Months?

*Written as a retrospective, six months after the demo app shipped.*

Presales engineers stopped opening Postman entirely for ACP demos. The app became the default tool for any conversation where a client asks "but what does this actually look like?" — and the question shifted from "can we show them the concept?" to "how do we customise the demo for this client's catalogue?"

The data told a clear story: zero live demo failures across the first ten presales engagements. The technical side panel turned out to be the feature that surprised us most — it was the non-technical stakeholders, not the developers, who kept pointing at the JSON payloads and asking questions. It made the API concrete for them in a way we hadn't anticipated.

What the success unlocked: conversations started about building a configurable version of the demo that can pull from a client's own commercetools project, and two partners requested access to the app to run their own ACP evaluations independently.

> "I showed it to the CTO and the VP of Commerce in the same meeting. The CTO immediately started asking about latency. The VP asked how long it would take to put their products in there. That's the first time I've had both of them engaged at the same time."

---

## Section 20 — Open Questions and Decisions Log

| ID | Question or Decision | Why It Matters | Owner | Target Resolution |
|---|---|---|---|---|
| OQ-001 | ~~What is the URL for `chatgpt-acp-connector-service-host`?~~ **RESOLVED** — `ACP_SERVICE_HOST=https://service-w6d3g47xvtzxf8xl8yrfab31.europe-west1.gcp.3.sandbox.commercetools.app` added to `.env`. | — | Developer | Resolved 2026-03-26 |
| OQ-002 | What is the expected timeline for the first presales demo using this app? | Determines how much scope can fit before the first real use. | Presales Lead | [OPEN QUESTION] |
| OQ-003 | Should the Stripe test key be rotated before first use? The key `sk_test_51SwO...` was shared in conversation — it may have been exposed. | Security hygiene; a leaked test key should be replaced even if financial risk is low. | Developer | Immediately |
| OQ-004 | Should API call logs be persisted to a file after each demo session? | Would allow post-demo debugging if a live failure occurs. | Developer | Before Phase 3 |
| OQ-005 | Is there a specific set of products in `pb-demo-jan26` that should always appear in the demo, or is random selection acceptable? | If the CT catalogue is sparse or has incomplete entries, random selection may produce poor results. | Developer | Before Phase 2 |
| OQ-006 | Does the ACP `/complete` endpoint accept the Stripe `shared_payment/granted_tokens` token format directly, or does it require a different Stripe token type? | If format is incompatible, the Stripe integration approach must change entirely. | Developer | Phase 1 exit |

---

## Section 21 — Appendix

### ACP API Endpoints (from Postman collection)

| Method | Path | Purpose |
|---|---|---|
| POST | `/checkout_sessions` | Create a new checkout session with buyer, items, and fulfillment address |
| POST | `/checkout_sessions/{id}` | Update an existing checkout session |
| POST | `/checkout_sessions/{id}/complete` | Complete checkout with `payment_data` (Stripe token + billing address) and buyer |
| POST | `/checkout_sessions/{id}/cancel` | Cancel an active checkout session |
| GET | `/checkout_sessions/{id}` | Retrieve current session state |

### Stripe Test Token Command
```bash
curl https://api.stripe.com/v1/test_helpers/shared_payment/granted_tokens \
  -u "{STRIPE_TEST_KEY}:" \
  -d payment_method=pm_card_visa \
  -d "usage_limits[currency]=usd" \
  -d "usage_limits[max_amount]=150000" \
  -d "usage_limits[expires_at]=1775847620"
```

### Environment Variables Required

| Variable | Description |
|---|---|
| `CTP_PROJECT_KEY` | commercetools project key |
| `CTP_CLIENT_SECRET` | commercetools API client secret |
| `CTP_CLIENT_ID` | commercetools API client ID |
| `CTP_AUTH_URL` | commercetools OAuth2 token endpoint |
| `CTP_API_URL` | commercetools REST API base URL |
| `CTP_SCOPES` | commercetools OAuth2 scopes |
| `ACP_SERVICE_HOST` | Base URL for the ACP checkout session service [OPEN QUESTION — not yet in .env] |
| `STRIPE_TEST_KEY` | Stripe test secret key for token generation |

### Glossary

| Term | Definition |
|---|---|
| ACP | Agentic Checkout Protocol — the API standard enabling AI agents to execute checkout flows on behalf of users |
| Checkout session | A server-side object representing a single in-progress checkout, managed by the ACP connector service |
| Stripe shared payment token | A test payment token generated by Stripe's test helpers API, used to simulate a completed payment without real card data |
| commercetools | Headless commerce platform providing the product catalogue and order management for this demo |
| `chatgpt-acp-connector-service-host` | The base URL of the ACP connector service that translates checkout session calls into commercetools operations |
