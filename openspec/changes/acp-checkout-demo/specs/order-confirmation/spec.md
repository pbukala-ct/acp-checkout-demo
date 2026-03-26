## ADDED Requirements

### Requirement: Order confirmation message in chat
The system SHALL display a human-readable order confirmation message in the chat thread upon successful completion of the ACP checkout session. The confirmation SHALL include the checkout session ID (as a proxy order reference) and a summary of the purchased product.

#### Scenario: Checkout completes successfully
- **WHEN** the POST /checkout_sessions/{id}/complete call returns a 201 response
- **THEN** the agent sends a confirmation message in the chat
- **AND** the message includes the session ID as an order reference
- **AND** the message names the product that was purchased
- **AND** the message communicates successful payment in plain language

#### Scenario: Confirmation is the terminal state of the demo flow
- **WHEN** the order confirmation message is displayed
- **THEN** no further checkout steps are triggered automatically
- **AND** the Reset control remains available to start a new demo run

### Requirement: Confirmation state is visually distinct
The order confirmation message SHALL be visually differentiated from regular agent messages to signal the successful end of the demo flow (e.g., a success colour, checkmark icon, or distinct card style).

#### Scenario: Confirmation renders with distinct styling
- **WHEN** the order confirmation message appears in the chat
- **THEN** it uses a distinct visual style (e.g., green accent, success icon) that differs from standard agent messages
- **AND** the styling is visible without the presenter drawing attention to it
