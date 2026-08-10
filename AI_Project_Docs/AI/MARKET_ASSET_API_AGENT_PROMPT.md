# AI Agent Task — Market Asset Price Integration

## 1. Project Goal

Implement a market-asset price integration inside the **existing Nuxt project**.

The website is a private/personal project used by the owner and friends, with **no more than approximately 10 users**.

The system should display:

- 🇺🇸 US stock prices
- ₿ Cryptocurrency prices
- 🥇 Gold price

Primary goals:

1. Keep the implementation simple.
2. Use free tiers where appropriate.
3. Keep API keys secure.
4. Avoid unnecessary architecture or infrastructure.
5. Minimize API usage with server-side caching.
6. Do not break or unnecessarily refactor the existing project.
7. Reuse the existing Firebase setup.

---

# 2. Selected API Providers

Use the following providers unless there is a documented technical or licensing problem:

### US Stocks

**Finnhub**

Website:
https://finnhub.io/

Use for US stock market data.

Examples:

- AAPL
- MSFT
- NVDA
- GOOGL
- AMZN
- META
- TSLA
- PLTR

### Cryptocurrency

**CoinGecko**

Website:
https://www.coingecko.com/en/api

Use for cryptocurrency prices.

Examples:

- BTC
- ETH
- SOL
- XRP
- BNB
- DOGE

### Gold

**Gold API**

Website:
https://gold-api.com/

Use for gold/XAU price data.

---

# 3. IMPORTANT — Inspect the Existing Project First

Before changing anything:

1. Inspect the existing project structure.
2. Identify the Nuxt version.
3. Identify whether the project uses Nuxt 3 or Nuxt 4.
4. Inspect `package.json`.
5. Inspect existing `nuxt.config.*`.
6. Inspect existing `.env` / `.env.example`.
7. Inspect Firebase configuration.
8. Inspect existing API/server code.
9. Identify the current dashboard/page where asset data should be displayed.
10. Check the existing coding style and naming conventions.

Do NOT blindly create a new architecture.

Do NOT replace existing Firebase configuration.

Do NOT migrate frameworks.

Do NOT rewrite unrelated components.

Do NOT install packages unless they are genuinely necessary.

If an existing utility or API abstraction already exists, reuse it where appropriate.

---

# 4. Required Architecture

Keep everything inside the existing Nuxt project.

Do NOT create a separate Express/NestJS/Node backend project.

Use Nuxt server routes as the backend layer.

Desired architecture:

```text
Browser
   │
   ▼
Nuxt Frontend
   │
   ▼
GET /api/assets
   │
   ▼
Nuxt Server
   │
   ├── Finnhub
   ├── CoinGecko
   └── Gold API
   │
   ▼
Server-side Cache
```

The browser must NOT directly call Finnhub, CoinGecko, or Gold API when an API key is required.

---

# 5. API Key Security

API credentials must remain server-side.

Use environment variables.

Example:

```env
FINNHUB_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here
```

If Gold API does not require an API key for the selected endpoint, do not invent one.

Never expose private API keys through:

- Vue components
- browser JavaScript
- `runtimeConfig.public`
- HTML
- client-side source code
- Git repository

Use Nuxt private runtime configuration/environment variables appropriately for the installed Nuxt version.

Also create/update:

```text
.env.example
```

with placeholder values only.

Never write real secrets into `.env.example`.

---

# 6. Internal API

Create a single normalized endpoint if the existing project architecture allows it:

```text
GET /api/assets
```

The frontend should consume this endpoint instead of knowing the individual external providers.

Recommended response structure:

```json
{
  "stocks": [],
  "crypto": [],
  "gold": {},
  "updatedAt": "2026-08-10T08:30:00.000Z"
}
```

Example stock object:

```json
{
  "symbol": "NVDA",
  "price": 180.25,
  "change": 2.31,
  "changePercent": 1.3,
  "currency": "USD"
}
```

Example crypto object:

```json
{
  "symbol": "BTC",
  "price": 115000,
  "changePercent": 1.82,
  "currency": "USD"
}
```

Example gold object:

```json
{
  "symbol": "XAU",
  "price": 4044,
  "currency": "USD",
  "unit": "oz"
}
```

Adapt field names if the existing project already has a suitable data model.

---

# 7. Configuration of Assets

Do not hard-code symbols throughout components.

Create one clear configuration source for the assets being displayed.

For example:

```ts
const STOCK_SYMBOLS = [
  'AAPL',
  'MSFT',
  'NVDA',
  'GOOGL',
  'AMZN',
  'META',
  'TSLA',
  'PLTR'
]
```

and equivalent configuration for crypto.

However, first inspect whether the existing application already stores a portfolio/watchlist. If it does, reuse that source instead of creating duplicate configuration.

---

# 8. Server-side Cache

Implement a lightweight server-side cache.

Target:

```text
Cache TTL: approximately 15–30 seconds
```

The exact implementation should fit the existing Nuxt deployment environment.

Do NOT introduce Redis for this project unless the existing project already uses Redis.

Do NOT introduce a database solely for current market prices.

The objective is:

```text
10 users
   ↓
same cached result
   ↓
few external API requests
```

not:

```text
10 users
   ↓
10 separate external API requests
```

The cache must have clear expiration behavior.

---

# 9. Provider Isolation

Each provider must be independent.

Do NOT allow one failed provider to make the entire `/api/assets` endpoint fail.

Desired behavior:

```text
Finnhub     → SUCCESS
CoinGecko   → SUCCESS
Gold API    → ERROR
```

Response should still contain:

```text
stocks → available
crypto → available
gold   → unavailable/error state
```

Use safe error handling.

Do not expose:

- API keys
- stack traces
- internal server paths
- sensitive provider credentials

to the client.

---

# 10. Frontend Integration

First find the appropriate existing page/component for displaying market assets.

Do not create a completely separate dashboard if an existing dashboard already exists.

Integrate with the existing UI/design system.

The frontend should have proper states for:

### Loading

Show the existing project's loading/skeleton pattern if available.

### Success

Display:

- Symbol
- Current price
- Change
- Change percentage
- Currency where appropriate
- Last updated time

### Error

Display a user-friendly message.

Example:

```text
Gold price temporarily unavailable
```

Do not crash the entire page.

### Partial failure

If stocks work but crypto fails, stocks must continue working.

---

# 11. Refresh Strategy

Do not poll every second.

Use approximately:

```text
15–30 seconds
```

for dashboard refresh, depending on the existing application architecture.

If the project already has a suitable polling/composable pattern, reuse it.

Avoid duplicate timers when the same page/component is mounted multiple times.

Make sure timers are cleaned up when components are destroyed/unmounted.

---

# 12. Firebase

The project already uses Firebase.

Keep the existing Firebase system.

Do not migrate authentication or Firestore.

Do not store every 15–30 second market-price update in Firestore.

Firebase should continue handling the application's existing responsibilities.

Market prices should be fetched from the external providers through the Nuxt server layer.

---

# 13. Dependencies

Before installing anything:

1. Check whether the required functionality can be implemented with existing Nuxt/Web APIs.
2. Prefer native `fetch` / `$fetch` and existing utilities.
3. Avoid unnecessary dependencies.
4. Do not add Redis.
5. Do not add a new backend framework.

If a package is absolutely necessary, explain why before adding it.

---

# 14. TypeScript

Use TypeScript if the existing project uses TypeScript.

Create clear interfaces/types for:

```text
StockAsset
CryptoAsset
GoldAsset
AssetsResponse
ProviderError
```

Do not use `any` unless there is a genuine reason.

Validate external API responses before trusting them.

External API data should not be assumed to always have the expected shape.

---

# 15. API Response Normalization

Each provider has different response formats.

Create provider-specific adapters/utilities.

Conceptually:

```text
server/
├── api/
│   └── assets.get.ts
│
└── utils/
    ├── finnhub.ts
    ├── coingecko.ts
    └── gold.ts
```

But adapt this to the existing project's structure.

The purpose is to keep provider-specific logic away from Vue components.

Frontend should receive one consistent format.

---

# 16. Performance

Optimize for a small private dashboard.

Priorities:

1. Low latency
2. Low API usage
3. Minimal frontend requests
4. Server-side caching
5. No unnecessary database writes
6. No unnecessary dependencies

Do not over-engineer.

---

# 17. Important Free-tier Considerations

Before implementation, verify the current API documentation and free-tier limitations of each provider.

Do not assume that an old quota or pricing rule is still valid.

Pay particular attention to:

- Request limits
- Authentication requirements
- CORS requirements
- Data delay
- Web display restrictions
- Personal-use restrictions
- Redistribution/commercial restrictions

This project is for private use by approximately 10 people.

If a provider's current terms make the intended use impossible, stop and report the issue before silently substituting another provider.

---

# 18. Testing Requirements

After implementation, test:

### API

```text
GET /api/assets
```

Verify:

- HTTP success
- correct JSON
- stocks returned
- crypto returned
- gold returned
- timestamp returned

### Error handling

Simulate or safely handle:

- Finnhub unavailable
- CoinGecko unavailable
- Gold API unavailable
- API timeout
- malformed provider response
- missing API key
- rate limit response

The system should degrade gracefully.

### Cache

Verify:

1. First request calls providers.
2. Requests within TTL use cached data.
3. After TTL expires, data refreshes.
4. Multiple users can share the cached response.

### Frontend

Verify:

- loading state
- successful data rendering
- partial failure
- complete failure
- refresh behavior
- no console errors
- no exposed API keys

---

# 19. Do Not Do These Things

Do NOT:

- Create a separate backend project.
- Rewrite the existing Nuxt project.
- Replace Firebase.
- Move unrelated files.
- Refactor unrelated code.
- Add Redis.
- Add a new database for market prices.
- Store API keys in frontend code.
- Put secrets in `runtimeConfig.public`.
- Poll every second.
- Store every price update in Firestore.
- Make the entire dashboard fail because one provider fails.
- Add unnecessary npm packages.
- Use fake/mock market prices in production code.
- Hard-code API keys.
- Claim data is real-time if the provider is delayed.
- Ignore provider terms or free-tier limits.

---

# 20. Expected Deliverables

At the end, provide a concise implementation report containing:

## Files created

List all new files.

## Files modified

List all modified files.

## Dependencies added

List any new packages and why they were needed.

## Environment variables

List required variables, but NEVER print actual secret values.

Example:

```text
FINNHUB_API_KEY
COINGECKO_API_KEY
```

## API

Confirm:

```text
GET /api/assets
```

## Cache

State:

```text
TTL = XX seconds
```

## Providers

Confirm:

```text
US Stocks → Finnhub
Crypto → CoinGecko
Gold → Gold API
```

## Testing

Report what was tested and whether it passed.

## Known limitations

Clearly list any limitations related to:

- free tier
- delayed data
- API quota
- provider availability
- licensing/usage terms

---

# 21. Implementation Philosophy

Follow this rule throughout the task:

> **Inspect first → plan minimally → implement → test → report.**

Do not make assumptions about the existing codebase.

Do not optimize prematurely.

Do not over-engineer a system intended for approximately 10 private users.

The final implementation should feel like a natural part of the existing Nuxt project, not a separate application bolted onto it.
