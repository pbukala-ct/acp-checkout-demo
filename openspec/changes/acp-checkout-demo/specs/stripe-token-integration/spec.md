## ADDED Requirements

### Requirement: Generate Stripe test token on startup
The system SHALL call `POST https://api.stripe.com/v1/test_helpers/shared_payment/granted_tokens` on application startup (or on first API route invocation) using the `STRIPE_TEST_KEY` environment variable. The generated token SHALL be cached in server-side memory and reused for all demo sessions during the process lifetime.

The request SHALL use:
- `payment_method=pm_card_visa`
- `usage_limits[currency]=usd`
- `usage_limits[max_amount]=150000`
- `usage_limits[expires_at]=1775847620`

#### Scenario: Token generated successfully
- **WHEN** the server starts and calls the Stripe test token endpoint
- **THEN** the returned token value is stored in server memory
- **AND** the UI displays a token readiness indicator (e.g. "Payment ready")

#### Scenario: Token generation fails
- **WHEN** the Stripe API call fails or returns an error
- **THEN** a prominent warning is displayed in the UI indicating payment token is unavailable
- **AND** the demo flow is blocked at the complete step until a token is available

### Requirement: Stripe token auto-injected into complete call
The system SHALL automatically use the cached Stripe token as `payment_data.token` in the `POST /checkout_sessions/{id}/complete` request body. The presenter SHALL NOT need to manually copy or paste the token.

#### Scenario: Complete call uses cached token
- **WHEN** the complete checkout session step is triggered
- **THEN** the request body includes `payment_data.token` set to the cached Stripe token
- **AND** `payment_data.provider` is set to `"stripe"`
- **AND** the full request payload is visible in the API debug panel

### Requirement: Stripe credentials never exposed client-side
The `STRIPE_TEST_KEY` environment variable SHALL only be accessed in Next.js API routes (server-side). It SHALL NEVER appear in the browser bundle, client-side code, or browser network requests.

#### Scenario: Stripe key remains server-side
- **WHEN** the browser dev tools network tab is inspected during a demo
- **THEN** no request originating from the browser contains the Stripe secret key
- **AND** all Stripe API calls are made from Next.js API routes on the server
