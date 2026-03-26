## ADDED Requirements

### Requirement: Create checkout session
The system SHALL call `POST {ACP_SERVICE_HOST}/checkout_sessions` after the user submits a valid shipping address. The request body SHALL include `buyer` (first_name, last_name, email, phone_number), `items` (array with selected product id and quantity 1), and `fulfillment_address` (name, line_one, line_two, city, country, postal_code). The call SHALL be made from a Next.js API route, never directly from the browser.

#### Scenario: Session created successfully
- **WHEN** the API route calls POST /checkout_sessions and receives a 201 response
- **THEN** the returned `id` is stored in application state as the active checkout session ID
- **AND** the agent sends a confirmation message including the session ID
- **AND** the API panel updates with the request body and response

#### Scenario: Session creation fails
- **WHEN** the POST /checkout_sessions call returns a non-201 status
- **THEN** the agent displays a human-readable error message in the chat
- **AND** the API panel shows the full error response body
- **AND** the flow does not advance to the complete step

### Requirement: Complete checkout session
The system SHALL call `POST {ACP_SERVICE_HOST}/checkout_sessions/{id}/complete` with the Stripe test token and buyer billing address after the session is created. The call SHALL be made automatically without requiring presenter intervention.

#### Scenario: Checkout completed successfully
- **WHEN** the complete API call returns a 201 response
- **THEN** the agent renders an order confirmation message in the chat
- **AND** the API panel shows the complete request and response payloads

#### Scenario: Complete call fails
- **WHEN** the complete API call returns a non-201 response
- **THEN** the agent displays a clear failure message with the error reason
- **AND** the session is not marked as complete
- **AND** the API panel shows the error response

### Requirement: Update checkout session (optional flow step)
The system SHALL support calling `POST {ACP_SERVICE_HOST}/checkout_sessions/{id}` to update fulfillment options or buyer details before completing. This step is optional and only triggered if the presenter initiates it.

#### Scenario: Session updated successfully
- **WHEN** the update API call returns a 201 response
- **THEN** the agent acknowledges the update in the chat
- **AND** the API panel shows the updated request and response

### Requirement: Cancel checkout session
The system SHALL support calling `POST {ACP_SERVICE_HOST}/checkout_sessions/{id}/cancel` to abandon an active session. This is triggered by the Reset control or an explicit cancel action.

#### Scenario: Session cancelled
- **WHEN** the cancel API call completes
- **THEN** the session ID is cleared from application state
- **AND** the chat reflects the cancellation
