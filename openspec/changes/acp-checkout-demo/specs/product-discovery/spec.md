## ADDED Requirements

### Requirement: Fetch products from commercetools on load
The system SHALL fetch a random selection of 3–6 products from the configured commercetools project (`CTP_PROJECT_KEY`) when the chat interface initialises, using the existing `lib/ct/` client modules. Each product returned MUST include at minimum: name (localised), price (centAmount + currency), and at least one image URL.

#### Scenario: Products fetched successfully
- **WHEN** the chat interface loads and commercetools returns products with complete data
- **THEN** 3 to 6 product cards are rendered in the chat thread
- **AND** each card displays the product name, price, and image

#### Scenario: Insufficient product data from commercetools
- **WHEN** the commercetools API returns fewer than 3 products with name + price + image
- **THEN** the app renders a hardcoded set of seed products instead
- **AND** each seed product card is labelled `[DEMO DATA]`

#### Scenario: commercetools API unreachable
- **WHEN** the commercetools API call fails with a network error or non-200 response
- **THEN** the app falls back to seed products
- **AND** a non-blocking warning is displayed indicating live data could not be loaded

### Requirement: Product cards are selectable
The system SHALL render each product as a selectable card in the chat thread. Selecting a card SHALL advance the agent flow to the product detail state.

#### Scenario: User selects a product
- **WHEN** the user clicks or taps a product card
- **THEN** the chat displays a product detail message with name, image, full price, and a short description
- **AND** the agent responds with a prompt to purchase or browse further

#### Scenario: Only one product can be active at a time
- **WHEN** the user selects a second product after already selecting one
- **THEN** the previously selected product is deselected
- **AND** the new product detail is shown
