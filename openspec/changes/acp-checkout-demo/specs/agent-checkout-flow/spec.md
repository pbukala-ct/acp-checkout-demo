## ADDED Requirements

### Requirement: Buy button initiates agent address collection
After a product is selected and displayed, the system SHALL show a "Buy" button (or equivalent chat action). Clicking it SHALL trigger the agent to collect the user's shipping address via a structured form rendered within the chat thread.

#### Scenario: User clicks Buy
- **WHEN** the user clicks the Buy button on a product detail card
- **THEN** the agent sends a message requesting shipping address details
- **AND** a structured address form is rendered in the chat (first name, last name, email, phone, address line 1, address line 2, city, postal code, country)

#### Scenario: User submits a valid address
- **WHEN** the user fills in all required address fields and submits
- **THEN** the agent acknowledges the address in a chat message
- **AND** the checkout session creation flow is initiated automatically

#### Scenario: User submits an incomplete address
- **WHEN** the user submits the form with one or more required fields empty
- **THEN** the form displays inline validation errors for the missing fields
- **AND** the agent flow does not advance until the form is valid

### Requirement: Agent dialogue is scripted and deterministic
The agent's messages SHALL be pre-written strings rendered with a simulated typing animation. No external LLM API SHALL be called to generate agent responses.

#### Scenario: Agent sends a message
- **WHEN** a new agent step is triggered (product selected, address submitted, session created, etc.)
- **THEN** the agent message appears with a brief typing animation (300–800ms) before the full text is shown
- **AND** the message content matches the pre-written script for that step

### Requirement: Demo reset
The system SHALL provide a visible "Reset" or "Start over" control that clears the current session state and returns the chat to the initial product-browse state.

#### Scenario: User resets the demo
- **WHEN** the user clicks the Reset control at any point in the flow
- **THEN** all session state (selected product, address, checkout session ID, Stripe token) is cleared
- **AND** the chat thread is cleared
- **AND** products are re-fetched from commercetools and displayed as fresh cards
