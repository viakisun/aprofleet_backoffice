<script lang="ts">
  interface ApiEndpoint {
    id: string;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    category: string;
    description: string;
    authentication: boolean;
    rateLimit: string;
    parameters?: ApiParameter[];
    requestBody?: ApiRequestBody;
    responses: ApiResponse[];
    examples: ApiExample[];
  }

  interface ApiParameter {
    name: string;
    type: string;
    required: boolean;
    description: string;
    default?: string;
  }

  interface ApiRequestBody {
    contentType: string;
    schema: Record<string, any>;
    example: string;
  }

  interface ApiResponse {
    status: number;
    description: string;
    schema?: Record<string, any>;
    example?: string;
  }

  interface ApiExample {
    title: string;
    request: string;
    response: string;
  }

  // State
  let selectedCategory = "all";
  let selectedMethod = "all";
  let searchQuery = "";
  let expandedEndpoint: string | null = null;

  // Mock API endpoints
  const categories = [
    "Vehicles",
    "Reservations",
    "Charging",
    "Users",
    "Golf Courses",
    "Models",
    "Firmware",
  ];

  const endpoints: ApiEndpoint[] = [
    {
      id: "get-vehicles",
      method: "GET",
      path: "/api/v1/vehicles",
      category: "Vehicles",
      description: "Retrieve a list of all vehicles with optional filtering",
      authentication: true,
      rateLimit: "100 req/min",
      parameters: [
        {
          name: "status",
          type: "string",
          required: false,
          description:
            "Filter by vehicle status (operating, charging, idle, maintenance, error)",
        },
        {
          name: "golfCourseId",
          type: "string",
          required: false,
          description: "Filter by golf course ID",
        },
        {
          name: "page",
          type: "integer",
          required: false,
          description: "Page number for pagination",
          default: "1",
        },
        {
          name: "limit",
          type: "integer",
          required: false,
          description: "Number of items per page",
          default: "20",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: JSON.stringify(
            {
              data: [
                {
                  id: "vehicle-1",
                  vin: "VIN123",
                  status: "operating",
                  batteryLevel: 85,
                  model: "Cart Pro X1",
                },
              ],
              pagination: { page: 1, limit: 20, total: 100 },
            },
            null,
            2,
          ),
        },
        {
          status: 401,
          description: "Unauthorized - Invalid or missing authentication token",
        },
        { status: 429, description: "Rate limit exceeded" },
      ],
      examples: [
        {
          title: "Get all operating vehicles",
          request:
            'curl -X GET "https://api.aprofleet.com/v1/vehicles?status=operating" \\\n  -H "Authorization: Bearer YOUR_TOKEN"',
          response: '{\n  "data": [...],\n  "pagination": {...}\n}',
        },
      ],
    },
    {
      id: "get-vehicle",
      method: "GET",
      path: "/api/v1/vehicles/:id",
      category: "Vehicles",
      description: "Retrieve detailed information about a specific vehicle",
      authentication: true,
      rateLimit: "100 req/min",
      parameters: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Unique vehicle identifier",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: JSON.stringify(
            {
              id: "vehicle-1",
              vin: "VIN123",
              status: "operating",
              batteryLevel: 85,
              location: { lat: 37.7749, lng: -122.4194 },
              model: "Cart Pro X1",
              lastService: "2025-09-15",
            },
            null,
            2,
          ),
        },
        { status: 404, description: "Vehicle not found" },
      ],
      examples: [],
    },
    {
      id: "post-reservation",
      method: "POST",
      path: "/api/v1/reservations",
      category: "Reservations",
      description: "Create a new vehicle reservation",
      authentication: true,
      rateLimit: "50 req/min",
      requestBody: {
        contentType: "application/json",
        schema: {
          vehicleId: "string",
          customerId: "string",
          startTime: "ISO 8601 datetime",
          endTime: "ISO 8601 datetime",
          notes: "string (optional)",
        },
        example: JSON.stringify(
          {
            vehicleId: "vehicle-1",
            customerId: "customer-123",
            startTime: "2025-10-24T08:00:00Z",
            endTime: "2025-10-24T12:00:00Z",
            notes: "VIP customer - ensure vehicle is clean",
          },
          null,
          2,
        ),
      },
      responses: [
        {
          status: 201,
          description: "Reservation created successfully",
          example: JSON.stringify(
            {
              id: "reservation-1",
              vehicleId: "vehicle-1",
              customerId: "customer-123",
              status: "confirmed",
              startTime: "2025-10-24T08:00:00Z",
              endTime: "2025-10-24T12:00:00Z",
            },
            null,
            2,
          ),
        },
        { status: 400, description: "Invalid request body" },
        {
          status: 409,
          description: "Vehicle not available for selected time slot",
        },
      ],
      examples: [
        {
          title: "Create a reservation",
          request:
            'curl -X POST "https://api.aprofleet.com/v1/reservations" \\\n  -H "Authorization: Bearer YOUR_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"vehicleId":"vehicle-1","customerId":"customer-123","startTime":"2025-10-24T08:00:00Z","endTime":"2025-10-24T12:00:00Z"}\'',
          response: '{\n  "id": "reservation-1",\n  "status": "confirmed"\n}',
        },
      ],
    },
    {
      id: "get-charging-stations",
      method: "GET",
      path: "/api/v1/charging/stations",
      category: "Charging",
      description: "Get list of charging stations with availability status",
      authentication: true,
      rateLimit: "100 req/min",
      parameters: [
        {
          name: "golfCourseId",
          type: "string",
          required: false,
          description: "Filter by golf course",
        },
        {
          name: "available",
          type: "boolean",
          required: false,
          description: "Filter by availability",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: JSON.stringify(
            {
              data: [
                {
                  id: "station-1",
                  name: "Station A1",
                  status: "available",
                  power: 7.2,
                  occupied: 2,
                  capacity: 4,
                },
              ],
            },
            null,
            2,
          ),
        },
      ],
      examples: [],
    },
    {
      id: "post-charging-session",
      method: "POST",
      path: "/api/v1/charging/sessions",
      category: "Charging",
      description: "Start a new charging session",
      authentication: true,
      rateLimit: "50 req/min",
      requestBody: {
        contentType: "application/json",
        schema: {
          vehicleId: "string",
          stationId: "string",
          targetSoc: "integer (0-100, optional)",
        },
        example: JSON.stringify(
          {
            vehicleId: "vehicle-1",
            stationId: "station-1",
            targetSoc: 100,
          },
          null,
          2,
        ),
      },
      responses: [
        {
          status: 201,
          description: "Charging session started",
          example: JSON.stringify(
            {
              id: "session-1",
              vehicleId: "vehicle-1",
              stationId: "station-1",
              status: "charging",
              startTime: "2025-10-23T10:00:00Z",
            },
            null,
            2,
          ),
        },
        { status: 409, description: "Station not available" },
      ],
      examples: [],
    },
    {
      id: "get-users",
      method: "GET",
      path: "/api/v1/users",
      category: "Users",
      description: "Retrieve list of users with role filtering",
      authentication: true,
      rateLimit: "100 req/min",
      parameters: [
        {
          name: "role",
          type: "string",
          required: false,
          description: "Filter by role (SUPER_ADMIN, TENANT_OWNER, etc.)",
        },
        {
          name: "active",
          type: "boolean",
          required: false,
          description: "Filter by active status",
        },
      ],
      responses: [
        {
          status: 200,
          description: "Successful response",
          example: JSON.stringify(
            {
              data: [
                {
                  id: "user-1",
                  name: "John Doe",
                  email: "john@example.com",
                  role: "TENANT_OWNER",
                  active: true,
                },
              ],
            },
            null,
            2,
          ),
        },
      ],
      examples: [],
    },
    {
      id: "put-vehicle",
      method: "PUT",
      path: "/api/v1/vehicles/:id",
      category: "Vehicles",
      description: "Update vehicle information",
      authentication: true,
      rateLimit: "50 req/min",
      parameters: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Vehicle ID",
        },
      ],
      requestBody: {
        contentType: "application/json",
        schema: {
          status: "string (optional)",
          maintenanceNotes: "string (optional)",
          assignedGolfCourseId: "string (optional)",
        },
        example: JSON.stringify(
          {
            status: "maintenance",
            maintenanceNotes: "Scheduled battery replacement",
          },
          null,
          2,
        ),
      },
      responses: [
        {
          status: 200,
          description: "Vehicle updated successfully",
          example: JSON.stringify(
            {
              id: "vehicle-1",
              status: "maintenance",
              maintenanceNotes: "Scheduled battery replacement",
            },
            null,
            2,
          ),
        },
      ],
      examples: [],
    },
    {
      id: "delete-reservation",
      method: "DELETE",
      path: "/api/v1/reservations/:id",
      category: "Reservations",
      description: "Cancel a reservation",
      authentication: true,
      rateLimit: "50 req/min",
      parameters: [
        {
          name: "id",
          type: "string",
          required: true,
          description: "Reservation ID",
        },
      ],
      responses: [
        { status: 204, description: "Reservation cancelled successfully" },
        { status: 404, description: "Reservation not found" },
        {
          status: 409,
          description: "Cannot cancel - reservation already started",
        },
      ],
      examples: [],
    },
  ];

  // Filter endpoints
  $: filteredEndpoints = endpoints.filter((endpoint) => {
    if (selectedCategory !== "all" && endpoint.category !== selectedCategory)
      return false;
    if (selectedMethod !== "all" && endpoint.method !== selectedMethod)
      return false;
    if (
      searchQuery &&
      !endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Group by category
  $: groupedEndpoints = filteredEndpoints.reduce(
    (acc, endpoint) => {
      if (!acc[endpoint.category]) {
        acc[endpoint.category] = [];
      }
      acc[endpoint.category].push(endpoint);
      return acc;
    },
    {} as Record<string, ApiEndpoint[]>,
  );

  function getMethodColor(method: string): string {
    switch (method) {
      case "GET":
        return "#1E90FF";
      case "POST":
        return "#32CD32";
      case "PUT":
        return "#FF8C00";
      case "PATCH":
        return "#9370DB";
      case "DELETE":
        return "#DC143C";
      default:
        return "var(--color-gray-40)";
    }
  }

  function toggleEndpoint(id: string) {
    expandedEndpoint = expandedEndpoint === id ? null : id;
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
</script>

<div class="api-docs-page">
  <!-- Header -->
  <div class="page-header">
    <div class="header-left">
      <h1 class="page-title">API DOCUMENTATION</h1>
      <p class="page-subtitle">REST API REFERENCE FOR APROFLEET v1.0</p>
    </div>
    <div class="api-info">
      <div class="info-item">
        <span class="label">BASE URL:</span>
        <code class="value">https://api.aprofleet.com/v1</code>
      </div>
      <div class="info-item">
        <span class="label">VERSION:</span>
        <span class="value">1.0.0</span>
      </div>
    </div>
  </div>

  <!-- Authentication Info -->
  <div class="auth-section">
    <h2 class="section-title">AUTHENTICATION</h2>
    <div class="auth-content">
      <p class="auth-text">
        All API requests require authentication using Bearer tokens. Include
        your API token in the Authorization header:
      </p>
      <div class="code-block">
        <code>Authorization: Bearer YOUR_API_TOKEN</code>
      </div>
      <p class="auth-text">
        API tokens can be generated in your account settings. Each token is
        associated with specific permissions based on your role.
      </p>
    </div>
  </div>

  <!-- Filters -->
  <div class="filters-section">
    <div class="filters-row">
      <div class="filter-group">
        <label for="category-filter">CATEGORY</label>
        <select id="category-filter" bind:value={selectedCategory}>
          <option value="all">All Categories</option>
          {#each categories as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>

      <div class="filter-group">
        <label for="method-filter">METHOD</label>
        <select id="method-filter" bind:value={selectedMethod}>
          <option value="all">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div class="filter-group search">
        <label for="search-filter">SEARCH</label>
        <input
          id="search-filter"
          type="text"
          placeholder="Search endpoints..."
          bind:value={searchQuery}
        />
      </div>
    </div>
  </div>

  <!-- Endpoints -->
  <div class="endpoints-section">
    <div class="endpoints-header">
      <h2 class="section-title">ENDPOINTS</h2>
      <div class="endpoints-count">{filteredEndpoints.length} endpoints</div>
    </div>

    {#each Object.entries(groupedEndpoints) as [category, categoryEndpoints]}
      <div class="category-group">
        <h3 class="category-title">{category}</h3>

        {#each categoryEndpoints as endpoint}
          <div
            class="endpoint-card"
            class:expanded={expandedEndpoint === endpoint.id}
          >
            <div
              class="endpoint-header"
              on:click={() => toggleEndpoint(endpoint.id)}
              on:keydown={(e) =>
                e.key === "Enter" && toggleEndpoint(endpoint.id)}
              role="button"
              tabindex="0"
            >
              <div class="endpoint-row">
                <span
                  class="method-badge"
                  style="color: {getMethodColor(endpoint.method)}"
                >
                  {endpoint.method}
                </span>
                <code class="endpoint-path">{endpoint.path}</code>
                {#if endpoint.authentication}
                  <span class="auth-badge">🔒 AUTH</span>
                {/if}
                <span class="rate-limit">{endpoint.rateLimit}</span>
                <span class="expand-icon"
                  >{expandedEndpoint === endpoint.id ? "▼" : "▶"}</span
                >
              </div>
              <div class="endpoint-description">
                {endpoint.description}
              </div>
            </div>

            {#if expandedEndpoint === endpoint.id}
              <div class="endpoint-details">
                <!-- Parameters -->
                {#if endpoint.parameters && endpoint.parameters.length > 0}
                  <div class="details-section">
                    <h4 class="details-title">PARAMETERS</h4>
                    <table class="params-table">
                      <thead>
                        <tr>
                          <th>NAME</th>
                          <th>TYPE</th>
                          <th>REQUIRED</th>
                          <th>DESCRIPTION</th>
                          <th>DEFAULT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {#each endpoint.parameters as param}
                          <tr>
                            <td><code>{param.name}</code></td>
                            <td><span class="param-type">{param.type}</span></td
                            >
                            <td>
                              <span
                                class="required-badge"
                                class:yes={param.required}
                              >
                                {param.required ? "YES" : "NO"}
                              </span>
                            </td>
                            <td>{param.description}</td>
                            <td><code>{param.default || "-"}</code></td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                {/if}

                <!-- Request Body -->
                {#if endpoint.requestBody}
                  <div class="details-section">
                    <h4 class="details-title">REQUEST BODY</h4>
                    <div class="content-type">
                      {endpoint.requestBody.contentType}
                    </div>
                    <div class="schema-section">
                      <div class="schema-title">SCHEMA:</div>
                      <pre class="code-block">{JSON.stringify(
                          endpoint.requestBody.schema,
                          null,
                          2,
                        )}</pre>
                    </div>
                    <div class="example-section">
                      <div class="example-title">EXAMPLE:</div>
                      <pre class="code-block">{endpoint.requestBody
                          .example}</pre>
                    </div>
                  </div>
                {/if}

                <!-- Responses -->
                <div class="details-section">
                  <h4 class="details-title">RESPONSES</h4>
                  {#each endpoint.responses as response}
                    <div class="response-item">
                      <div class="response-header">
                        <span
                          class="status-code"
                          class:success={response.status < 300}
                          class:error={response.status >= 400}
                        >
                          {response.status}
                        </span>
                        <span class="response-description"
                          >{response.description}</span
                        >
                      </div>
                      {#if response.example}
                        <pre class="code-block">{response.example}</pre>
                      {/if}
                    </div>
                  {/each}
                </div>

                <!-- Examples -->
                {#if endpoint.examples && endpoint.examples.length > 0}
                  <div class="details-section">
                    <h4 class="details-title">EXAMPLES</h4>
                    {#each endpoint.examples as example}
                      <div class="example-item">
                        <div class="example-header">
                          <span class="example-name">{example.title}</span>
                          <button
                            class="copy-button"
                            on:click={() => copyToClipboard(example.request)}
                          >
                            COPY
                          </button>
                        </div>
                        <div class="example-label">REQUEST:</div>
                        <pre class="code-block">{example.request}</pre>
                        <div class="example-label">RESPONSE:</div>
                        <pre class="code-block">{example.response}</pre>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}

    {#if filteredEndpoints.length === 0}
      <div class="empty-state">
        <p>NO ENDPOINTS FOUND</p>
        <p class="empty-hint">Try adjusting your filters or search query</p>
      </div>
    {/if}
  </div>

  <!-- Rate Limits Info -->
  <div class="info-section">
    <h2 class="section-title">RATE LIMITS</h2>
    <div class="info-content">
      <p>
        API requests are rate-limited to prevent abuse and ensure service
        stability:
      </p>
      <ul>
        <li><strong>Read operations (GET):</strong> 100 requests per minute</li>
        <li>
          <strong>Write operations (POST, PUT, PATCH, DELETE):</strong> 50 requests
          per minute
        </li>
        <li><strong>Burst limit:</strong> 150 requests per 10 seconds</li>
      </ul>
      <p>Rate limit headers are included in all responses:</p>
      <div class="code-block">
        <code>X-RateLimit-Limit: 100</code><br />
        <code>X-RateLimit-Remaining: 95</code><br />
        <code>X-RateLimit-Reset: 1698765432</code>
      </div>
    </div>
  </div>

  <!-- Error Codes -->
  <div class="info-section">
    <h2 class="section-title">ERROR CODES</h2>
    <div class="info-content">
      <table class="error-table">
        <thead>
          <tr>
            <th>CODE</th>
            <th>DESCRIPTION</th>
          </tr>
        </thead>
        <tbody>
          <tr
            ><td>400</td><td
              >Bad Request - Invalid request format or parameters</td
            ></tr
          >
          <tr
            ><td>401</td><td
              >Unauthorized - Missing or invalid authentication token</td
            ></tr
          >
          <tr
            ><td>403</td><td
              >Forbidden - Insufficient permissions for this operation</td
            ></tr
          >
          <tr
            ><td>404</td><td>Not Found - Requested resource does not exist</td
            ></tr
          >
          <tr
            ><td>409</td><td>Conflict - Request conflicts with current state</td
            ></tr
          >
          <tr><td>422</td><td>Unprocessable Entity - Validation errors</td></tr>
          <tr><td>429</td><td>Too Many Requests - Rate limit exceeded</td></tr>
          <tr
            ><td>500</td><td
              >Internal Server Error - Something went wrong on our end</td
            ></tr
          >
          <tr
            ><td>503</td><td
              >Service Unavailable - Temporary service disruption</td
            ></tr
          >
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .api-docs-page {
    padding: var(--space-6);
    max-width: var(--content-max-width);
    margin: 0 auto;
  }

  /* Header */
  .page-header {
    margin-bottom: var(--space-6);
  }

  .page-title {
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
    margin-bottom: var(--space-2);
  }

  .page-subtitle {
    font-size: var(--text-sm);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wide);
    margin-bottom: var(--space-4);
  }

  .api-info {
    display: flex;
    gap: var(--space-6);
    flex-wrap: wrap;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  .info-item .label {
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wider);
    font-weight: var(--font-semibold);
  }

  .info-item code.value {
    font-family: var(--font-mono);
    background: var(--color-gray-08);
    padding: var(--space-1) var(--space-2);
    border: var(--border-width) solid var(--color-gray-20);
  }

  .info-item .value {
    font-weight: var(--font-medium);
  }

  .section-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
    margin-bottom: var(--space-4);
  }

  /* Authentication */
  .auth-section {
    margin-bottom: var(--space-6);
    padding: var(--space-6);
    border: var(--border-width) solid var(--color-black);
    background: var(--color-gray-04);
  }

  .auth-content {
    font-size: var(--text-sm);
    line-height: 1.6;
  }

  .auth-text {
    margin-bottom: var(--space-3);
  }

  .code-block {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    background: var(--color-white);
    padding: var(--space-3);
    border: var(--border-width) solid var(--color-gray-20);
    overflow-x: auto;
    margin: var(--space-3) 0;
  }

  /* Filters */
  .filters-section {
    margin-bottom: var(--space-6);
    padding: var(--space-4);
    border: var(--border-width) solid var(--color-black);
    background: var(--color-white);
  }

  .filters-row {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 150px;
  }

  .filter-group.search {
    flex: 1;
    min-width: 250px;
  }

  .filter-group label {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wider);
    color: var(--color-gray-40);
  }

  .filter-group select,
  .filter-group input {
    padding: var(--space-2);
    border: var(--border-width) solid var(--color-gray-20);
    background: var(--color-white);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  /* Endpoints */
  .endpoints-section {
    margin-bottom: var(--space-6);
  }

  .endpoints-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .endpoints-count {
    font-size: var(--text-sm);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wide);
  }

  .category-group {
    margin-bottom: var(--space-6);
  }

  .category-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: 2px solid var(--color-black);
  }

  .endpoint-card {
    border: var(--border-width) solid var(--color-black);
    margin-bottom: var(--space-3);
    background: var(--color-white);
  }

  .endpoint-card.expanded {
    border-color: var(--color-black);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .endpoint-header {
    padding: var(--space-4);
    cursor: pointer;
    transition: background var(--duration-fast) var(--easing-linear);
  }

  .endpoint-header:hover {
    background: var(--color-gray-04);
  }

  .endpoint-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .method-badge {
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wider);
    min-width: 60px;
    flex-shrink: 0;
  }

  .endpoint-path {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    flex: 1;
  }

  .auth-badge {
    font-size: var(--text-xs);
    padding: 4px var(--space-2);
    background: var(--color-gray-08);
    border: var(--border-width) solid var(--color-gray-20);
    letter-spacing: var(--tracking-wide);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .rate-limit {
    font-size: var(--text-xs);
    color: var(--color-gray-40);
    font-family: var(--font-mono);
    white-space: nowrap;
    margin-left: auto;
    flex-shrink: 0;
  }

  .expand-icon {
    font-size: 10px;
    color: var(--color-gray-40);
    flex-shrink: 0;
    margin-left: var(--space-2);
  }

  .endpoint-description {
    font-size: var(--text-sm);
    color: var(--color-gray-60);
    line-height: 1.5;
  }

  .endpoint-details {
    border-top: var(--border-width) solid var(--color-gray-12);
    background: var(--color-gray-04);
  }

  .details-section {
    padding: var(--space-4);
    border-bottom: var(--border-width) solid var(--color-gray-12);
  }

  .details-section:last-child {
    border-bottom: none;
  }

  .details-title {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
    margin-bottom: var(--space-3);
  }

  /* Parameters Table */
  .params-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
    background: var(--color-white);
  }

  .params-table th {
    text-align: left;
    padding: var(--space-2);
    background: var(--color-gray-08);
    border: var(--border-width) solid var(--color-gray-20);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
    font-size: var(--text-xs);
  }

  .params-table td {
    padding: var(--space-2);
    border: var(--border-width) solid var(--color-gray-12);
  }

  .params-table code {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .param-type {
    color: #1e90ff;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .required-badge {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wide);
    padding: 2px var(--space-1);
    color: var(--color-gray-40);
  }

  .required-badge.yes {
    color: #dc143c;
  }

  /* Request/Response */
  .content-type {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-gray-40);
    margin-bottom: var(--space-2);
  }

  .schema-section,
  .example-section {
    margin-bottom: var(--space-3);
  }

  .schema-title,
  .example-title,
  .example-label {
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
    color: var(--color-gray-40);
    margin-bottom: var(--space-1);
  }

  .response-item {
    margin-bottom: var(--space-3);
  }

  .response-item:last-child {
    margin-bottom: 0;
  }

  .response-header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-2);
  }

  .status-code {
    font-family: var(--font-mono);
    font-weight: var(--font-semibold);
    font-size: var(--text-sm);
    padding: var(--space-1) var(--space-2);
    background: var(--color-white);
    border: var(--border-width) solid var(--color-gray-20);
  }

  .status-code.success {
    color: #32cd32;
    border-color: #32cd32;
  }

  .status-code.error {
    color: #dc143c;
    border-color: #dc143c;
  }

  .response-description {
    font-size: var(--text-sm);
  }

  /* Examples */
  .example-item {
    margin-bottom: var(--space-4);
  }

  .example-item:last-child {
    margin-bottom: 0;
  }

  .example-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }

  .example-name {
    font-weight: var(--font-semibold);
  }

  .copy-button {
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-xs);
    background: var(--color-white);
    border: var(--border-width) solid var(--color-gray-20);
  }

  .copy-button:hover {
    background: var(--color-gray-08);
  }

  /* Info Sections */
  .info-section {
    margin-bottom: var(--space-6);
    padding: var(--space-6);
    border: var(--border-width) solid var(--color-black);
    background: var(--color-white);
  }

  .info-content {
    font-size: var(--text-sm);
    line-height: 1.6;
  }

  .info-content p {
    margin-bottom: var(--space-3);
  }

  .info-content ul {
    list-style: none;
    padding: 0;
    margin: var(--space-3) 0;
  }

  .info-content li {
    padding: var(--space-2) 0;
    padding-left: var(--space-4);
    position: relative;
  }

  .info-content li::before {
    content: "•";
    position: absolute;
    left: var(--space-2);
  }

  .error-table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--text-sm);
  }

  .error-table th {
    text-align: left;
    padding: var(--space-2);
    background: var(--color-gray-08);
    border: var(--border-width) solid var(--color-gray-20);
    font-weight: var(--font-semibold);
    letter-spacing: var(--tracking-wider);
  }

  .error-table td {
    padding: var(--space-2);
    border: var(--border-width) solid var(--color-gray-12);
  }

  .error-table td:first-child {
    font-family: var(--font-mono);
    font-weight: var(--font-semibold);
    width: 80px;
  }

  /* Empty State */
  .empty-state {
    padding: var(--space-8);
    text-align: center;
    border: var(--border-width) solid var(--color-gray-20);
    background: var(--color-gray-04);
  }

  .empty-state p {
    font-size: var(--text-lg);
    color: var(--color-gray-40);
    letter-spacing: var(--tracking-wider);
    margin-bottom: var(--space-2);
  }

  .empty-hint {
    font-size: var(--text-sm) !important;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .api-docs-page {
      padding: var(--space-4);
    }

    .endpoint-row {
      flex-wrap: wrap;
    }

    .rate-limit {
      margin-left: 0;
      order: 3;
    }

    .expand-icon {
      margin-left: auto;
      order: 4;
    }
  }

  @media (max-width: 640px) {
    .api-docs-page {
      padding: var(--space-3);
    }

    .page-title {
      font-size: var(--text-xl);
    }

    .filters-row {
      flex-direction: column;
    }

    .filter-group {
      min-width: unset;
    }

    .endpoint-path {
      flex-basis: 100%;
    }

    .params-table {
      font-size: var(--text-xs);
    }

    .code-block {
      font-size: var(--text-xs);
    }
  }
</style>
