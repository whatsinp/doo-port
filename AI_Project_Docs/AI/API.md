# API

Version: 1.0

---

# Overview

This document defines the API architecture, external service integrations, internal service layer, and communication rules for the Investment Portfolio Tracker.

The application must never tightly couple business logic with external APIs.

All external services must be accessed through an abstraction layer.

---

# Architecture

```text
Vue Page

↓

Composable

↓

Service

↓

Repository

↓

External API / Firebase
```

UI Components must never call external APIs directly.

---

# API Design Principles

Always

- Separate business logic from API logic
- Support future API replacement
- Handle failures gracefully
- Return standardized responses
- Use asynchronous requests
- Cache when appropriate

Never

- Call APIs directly inside Vue Components
- Mix Firebase logic with market APIs
- Hardcode API URLs

---

# Service Layers

## Authentication Service

Responsibilities

- Register
- Login
- Logout
- Google Login
- Email Verification
- Password Reset
- Session Management

Provider

Firebase Authentication

---

## User Service

Responsibilities

- Get User
- Update User
- Upload Profile Image
- Update Settings

Provider

Firestore

Storage

---

## Portfolio Service

Responsibilities

- Create Portfolio
- Rename Portfolio
- Delete Portfolio
- Reorder Portfolio
- Move Assets
- Portfolio Summary

Provider

Firestore

---

## Investment Service

Responsibilities

- Buy Assets
- Sell Assets
- Edit Transactions
- Delete Transactions
- Calculate Holdings
- Calculate Average Cost

Provider

Firestore

---

## Cash Service

Responsibilities

- Deposit Cash
- Withdraw Cash
- Get Balance
- Transaction History

Provider

Firestore

---

## Market Service

Responsibilities

- Search Assets
- Asset Detail
- Current Price
- Historical Prices
- Market Categories

Provider

External Market API

---

## Favorite Service

Responsibilities

- Add Favorite
- Remove Favorite
- Favorite List

Provider

Firestore

---

## Notification Service

Responsibilities

- Notification List
- Read Notification
- Delete Notification

Provider

Firestore

---

## Admin Service

Responsibilities

- User Management
- Statistics
- Suspend User
- Reactivate User

Provider

Firestore

---

# External APIs

The development team is responsible for selecting free APIs.

Architecture must support replacing APIs without changing business logic.

Possible providers

- Twelve Data
- Alpha Vantage
- Finnhub
- Financial Modeling Prep
- Polygon.io
- Yahoo Finance (if available)
- ExchangeRate API
- Gold Price API

The application must never depend on a single provider.

---

# API Abstraction

Every external provider must implement the same interface.

Example

```typescript
interface MarketRepository {
  searchAssets()

  getAsset()

  getQuote()

  getHistoricalData()
}
```

Switching providers should only require replacing the repository implementation.

---

# API Response Standard

Every service should return a standard response.

```typescript
interface ApiResponse<T> {
  success: boolean

  message: string

  data: T | null
}
```

---

# Error Response

```typescript
interface ApiError {
  code: string

  message: string
}
```

---

# HTTP Status Mapping

Success

200

Created

201

Unauthorized

401

Forbidden

403

Not Found

404

Conflict

409

Validation Error

422

Server Error

500

Gateway Error

502

Timeout

504

---

# API Retry Policy

Retry

- Network Error
- Timeout
- Temporary Service Failure

Maximum Retry

3

Use exponential backoff.

Never retry

- Authentication Error
- Permission Error
- Validation Error

---

# Timeout

Every external request should timeout.

Recommended

10 seconds

---

# Caching

Cache

Market Search

Ticker Information

Historical Prices

Exchange Rate

Do not cache

Authentication

Portfolio

Investment Records

Cash Balance

User Profile

---

# Authentication Flow

Register

↓

Verify Email

↓

Login

↓

Create Session

↓

Access Application

---

# Authorization

Every authenticated request must verify

- User Identity
- User Status
- Permission

Suspended users cannot access the application.

---

# Firestore API Rules

Always

Validate user ownership.

Example

A user may only access

- Their profile
- Their portfolios
- Their investments
- Their favorites
- Their notifications

Never expose other users' data.

---

# Market API Rules

Search

Supports

- Company Name
- Ticker Symbol

Categories

- Thai Stocks
- US Stocks
- ETF
- Gold
- Currency

Autocomplete required.

---

# Historical Price Rules

Supported

- 1D
- 5D
- 1W
- 1M
- 6M
- YTD
- 1Y
- 5Y

If unavailable

Return

```json
{
  "success": false,
  "message": "Timeframe unavailable"
}
```

---

# Currency Conversion

Supported

USD

THB

Exchange rates should come from an external exchange rate provider.

Architecture must support future providers.

---

# Rate Limiting

Respect provider limitations.

Never spam APIs.

Cache responses whenever appropriate.

---

# Logging

Every failed request should log

- Timestamp
- Endpoint
- Error Code
- Error Message

Never log

- Password
- Access Token
- Sensitive User Data

---

# Offline Handling

When network is unavailable

Display cached data when possible.

Otherwise

Display a friendly error message.

---

# Future APIs

Architecture should support

- Dividend API
- News API
- Earnings API
- Price Alert API
- Watchlist API
- Portfolio Analytics API

No architectural changes should be required.

---

# Security

Never expose

API Keys

Secrets

Private Tokens

Always use

Runtime Environment Variables

Server-side configuration

Secure Firebase Rules

---

# Versioning

Future APIs should support

Versioning

Example

```text
/api/v1/market

/api/v1/portfolio

/api/v1/profile
```

Never introduce breaking changes without creating a new API version.

---

# Authoritative Transport Boundary

Firebase client repositories may read user-owned presentation data only where Firestore rules can enforce ownership safely.

The following operations are trusted server operations exposed through Firebase Hosting rewrites to Cloud Functions:

- Market data and FX provider access
- Financial transaction creation, reversal, and projection updates
- Portfolio limit and favorite limit enforcement
- Account suspension, custom-claim management, and admin statistics
- Quote caching, valuation snapshots, audit logging, and rate limiting

Static Nuxt output does not execute `Nuxt Server Routes`. A production secret must never be placed in `NUXT_PUBLIC_*` runtime configuration.

---

# Required Endpoint Contracts

Every endpoint defines an authenticated actor, Zod input schema, typed output schema, error code, request ID, and retryability.

```text
GET  /api/v1/market/search
GET  /api/v1/market/instruments/{instrumentId}
GET  /api/v1/market/quotes
GET  /api/v1/market/history
GET  /api/v1/market/exchange-rates

POST /api/v1/portfolios
PATCH /api/v1/portfolios/{portfolioId}
POST /api/v1/portfolios/reorder
POST /api/v1/portfolios/{portfolioId}/transfers

POST /api/v1/transactions
POST /api/v1/transactions/{transactionId}/reverse
GET  /api/v1/transactions
GET  /api/v1/dashboard/summary
GET  /api/v1/dashboard/valuations

POST /api/v1/favorites
DELETE /api/v1/favorites/{instrumentId}
GET  /api/v1/notifications
POST /api/v1/notifications/read-all

GET  /api/v1/admin/users
POST /api/v1/admin/users/{uid}/suspend
POST /api/v1/admin/users/{uid}/reactivate
GET  /api/v1/admin/statistics
```

List endpoints use opaque cursor pagination and bounded limits. Mutating endpoints require an `operationId` idempotency key. Market responses include `source`, `asOf`, `isDelayed`, and `isStale`.

---

# Market Provider Contract

Each provider adapter must declare supported markets, asset classes, timeframes, quote delay, request limits, attribution requirements, and fallback eligibility. Provider selection cannot be deferred beyond the technical design phase.
