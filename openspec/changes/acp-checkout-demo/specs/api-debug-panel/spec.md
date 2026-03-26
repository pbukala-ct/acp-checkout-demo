## ADDED Requirements

### Requirement: Collapsible API payload panel
The system SHALL render a collapsible panel alongside the chat thread. The panel SHALL be togglable by the presenter at any point during the demo without interrupting the chat flow. Default state SHALL be collapsed.

#### Scenario: Presenter opens the panel
- **WHEN** the presenter clicks the panel toggle button
- **THEN** the panel expands to show the API call log
- **AND** the chat thread remains visible and functional

#### Scenario: Presenter closes the panel
- **WHEN** the presenter clicks the toggle button while the panel is open
- **THEN** the panel collapses
- **AND** the chat thread expands to fill the full width

### Requirement: Panel updates on every ACP API call
The system SHALL update the API panel in real time each time an ACP API call is made. Each entry SHALL show: HTTP method, endpoint URL, request body (formatted JSON), HTTP status code, and response body (formatted JSON).

#### Scenario: ACP API call is made
- **WHEN** any call to the ACP connector service completes (create, update, complete, cancel, or get session)
- **THEN** a new entry appears in the API panel
- **AND** the entry shows the method, URL, status code, request JSON, and response JSON
- **AND** the JSON is pretty-printed (not minified)

#### Scenario: API call results in an error
- **WHEN** an ACP call returns a non-2xx status code
- **THEN** the panel entry is highlighted in a distinct error colour
- **AND** the full error response body is shown in the panel

### Requirement: Panel entries are persistent during the session
All API calls made during a single demo session SHALL remain visible in the panel log (not overwritten). The presenter SHALL be able to scroll through the full call history.

#### Scenario: Multiple API calls in sequence
- **WHEN** the demo progresses through create → complete session calls
- **THEN** the panel shows all calls in chronological order
- **AND** the panel scrolls to the most recent entry automatically
