# DATABASE

Version: 1.0

Database: Cloud Firestore

---

# Overview

The application uses **Cloud Firestore** as the primary database.

Design goals

- Scalable
- Secure
- Simple
- Cost-efficient
- Realtime Ready
- Easy to Maintain

---

# Database Principles

Always

- Normalize data when appropriate
- Avoid duplicated information
- Use Document References when possible
- Store timestamps as Firestore Timestamp
- Keep documents small
- Optimize for read performance

Never

- Store calculated values unless necessary
- Store sensitive information
- Store passwords
- Store API Keys

---

# Collections

```text
users

portfolios

assets

transactions

favorites

notifications

settings
```

---

# Collection

## users

Document ID

```text
uid
```

Fields

```typescript
{
  uid: string

  email: string

  firstName: string

  lastName: string

  nickname: string

  profileImage: string | null

  language: 'th' | 'en'

  theme: 'light' | 'dark' | 'system'

  defaultCurrency: 'USD' | 'THB'

  role: 'user' | 'admin'

  status: 'active' | 'suspended'

  emailVerified: boolean

  createdAt: Timestamp

  updatedAt: Timestamp

  lastLoginAt: Timestamp
}
```

---

# Collection

## portfolios

Document ID

```text
portfolioId
```

Fields

```typescript
{
  id: string

  userId: string

  name: string

  description: string

  order: number

  isDefault: boolean

  // Deprecated. Cash is projected into cashAccounts by trusted backend code.

  createdAt: Timestamp

  updatedAt: Timestamp
}
```

Business Rules

- Maximum 10 custom portfolios
- `All Portfolio` is a virtual aggregate, not a document in this collection

---

# Collection

## assets

Stores current holdings.

Document ID

```text
assetId
```

Fields

```typescript
{
  id: string

  userId: string

  portfolioId: string

  ticker: string

  symbol: string

  companyName: string

  market: string

  assetType: 'stock' | 'etf' | 'gold' | 'currency'

  currency: 'USD' | 'THB'

  quantity: number

  averageCost: number

  totalCost: number

  realizedProfit: number

  unrealizedProfit: number

  currentPrice: number

  currentValue: number

  createdAt: Timestamp

  updatedAt: Timestamp
}
```

Business Rules

- One document per asset per portfolio.
- Average Cost is recalculated after every buy/sell.
- Current price is updated from market API.
- Profit values are calculated by the application.

---

# Collection

## transactions

Stores every buy, sell, cash deposit and cash withdrawal.

Document ID

```text
transactionId
```

Fields

```typescript
{
    id: string

    userId: string

    portfolioId: string

    assetId: string | null

    type:
        | 'buy'
        | 'sell'
        | 'deposit'
        | 'withdraw'
        | 'reversal'
        | 'transfer'

    ticker: string | null

    companyName: string | null

    quantity: number | null

    unitPrice: number | null

    totalAmount: number

    currency: 'USD' | 'THB'

    exchangeRate: number | null

    note: string

    transactionDate: Timestamp

    createdAt: Timestamp

    updatedAt: Timestamp
}
```

Business Rules

- Every investment action creates one transaction.
- Never overwrite previous transactions.
- Corrections create reversal and replacement ledger events.
- Deletion means a validated reversal; it never removes financial history.
- Transactions are immutable except user edits.
- Deleting requires confirmation.

---

# Collection

## favorites

Document ID

```text
favoriteId
```

Fields

```typescript
{
  id: string

  userId: string

  ticker: string

  companyName: string

  market: string

  assetType: string

  createdAt: Timestamp
}
```

Business Rules

- Maximum 20 favorites
- Duplicate favorites are not allowed

---

# Collection

## notifications

Document ID

```text
notificationId
```

Fields

```typescript
{
    id: string

    userId: string

    title: string

    message: string

    type:
        | 'system'
        | 'portfolio'
        | 'account'

    isRead: boolean

    createdAt: Timestamp
}
```

Business Rules

- Notifications exist only inside the application.
- Push notifications are not included in MVP.

---

# Collection

## settings

Document ID

```text
uid
```

Fields

```typescript
{
  userId: string

  language: 'th' | 'en'

  theme: 'light' | 'dark' | 'system'

  defaultCurrency: 'USD' | 'THB'

  updatedAt: Timestamp
}
```

---

# Relationships

```text
User

│

├── Portfolios

│      │

│      ├── Assets

│      │

│      └── Transactions

│

├── Favorites

│

├── Notifications

│

└── Settings
```

---

# Firestore Indexes

Recommended Composite Indexes

```text
portfolios

userId ASC

order ASC
```

```text
assets

userId ASC

portfolioId ASC

ticker ASC
```

```text
transactions

userId ASC

portfolioId ASC

transactionDate DESC
```

```text
favorites

userId ASC

ticker ASC
```

```text
notifications

userId ASC

createdAt DESC
```

---

# Security Rules

Users may only access

- Their own profile
- Their own portfolios
- Their own assets
- Their own transactions
- Their own favorites
- Their own notifications
- Their own settings

Admins

- Manage users
- View statistics
- Suspend users

Admins should never modify financial records unless explicitly required.

---

# Soft Delete

Current MVP

Not implemented.

Delete operations permanently remove documents.

Future versions may introduce

```text
deletedAt
deletedBy
```

---

# Audit Log

Current MVP

Not required.

Future versions may add

```text
auditLogs
```

---

# Timestamp Rules

Every collection should include

```typescript
createdAt

updatedAt
```

Whenever applicable

```typescript
lastLoginAt

transactionDate
```

Always use

Firestore Timestamp

Never store dates as strings.

---

# Currency Rules

Supported

```text
USD

THB
```

Exchange rate

Stored at transaction time.

Historical transactions never change when exchange rates update.

---

# Profit Calculation

Application calculates

- Average Cost
- Current Value
- Unrealized Profit
- Realized Profit
- Total Profit

Calculated values should not rely solely on database storage.

Business logic belongs in the Service Layer.

---

# Portfolio Rules

Maximum

```text
10
```

`All Portfolio` is a virtual read model.

Rules

- It has no Firestore document and cannot be edited, deleted, or reordered.
- It aggregates every custom portfolio at query or dashboard-service level.

---

# Transaction Rules

Supported Types

```text
buy

sell

deposit

withdraw
```

Every transaction

- Has its own document
- Is timestamped
- Can contain an optional note

---

# Future Collections

Reserved for future versions

```text
watchlists

priceAlerts

dividends

marketNews

analytics

auditLogs

subscriptions

payments
```

---

# Database Migration Policy

Schema changes must

- Preserve existing user data
- Be backward compatible whenever possible
- Include migration scripts if required
- Update PROJECT.md
- Update CHANGELOG.md
- Update API.md

---

# Naming Convention

Collections

```text
camelCase
```

Fields

```text
camelCase
```

Document IDs

```text
Firestore Auto ID
```

except

```text
users/{uid}

settings/{uid}
```

which use the Firebase Authentication UID directly.

---

# Authoritative Data Model Additions

The following definitions supplement and override earlier ambiguous fields.

## Portfolio Ownership

`All Portfolio` is virtual and has no document, cash balance, or asset documents. `portfolios` contains only custom portfolios. A user may own at most 10 custom portfolios.

## marketInstruments

Provider and market metadata are server-owned.

```typescript
{
  id: string
  assetClass: 'stock' | 'etf' | 'gold' | 'currency'
  displaySymbol: string
  exchange: string
  mic: string | null
  name: string
  tradingCurrency: 'USD' | 'THB'
  providerIds: Record<string, string>
  quantityScale: number
  priceScale: number
  isActive: boolean
  updatedAt: Timestamp
}
```

## cashAccounts

Cash is a projection of the transaction ledger and never a mutable duplicate on `portfolios`.

```typescript
{
  id: string
  userId: string
  portfolioId: string
  currency: 'USD' | 'THB'
  availableBalance: string
  updatedAt: Timestamp
  calculationVersion: number
}
```

## portfolioValuations

One server-owned snapshot exists per portfolio and valuation date.

```typescript
{
  id: string
  userId: string
  portfolioId: string
  valuationDate: string
  displayCurrency: 'USD' | 'THB'
  holdingsValue: string
  cashValue: string
  totalValue: string
  quoteAsOf: Timestamp
  fxAsOf: Timestamp
  calculationVersion: number
  createdAt: Timestamp
}
```

## searchHistory

```typescript
{
  id: string
  userId: string
  instrumentId: string
  searchedAt: Timestamp
}
```

## adminAuditLogs

```typescript
{
  id: string
  actorUserId: string
  targetUserId: string
  action: 'suspend' | 'reactivate' | 'profileUpdate' | 'roleUpdate'
  reason: string
  createdAt: Timestamp
}
```

## Transaction Field Requirements

Every financial transaction additionally stores `instrumentId`, `grossAmount`, `fees`, `taxes`, `netAmount`, `tradeCurrency`, `operationId`, `createdBy`, and `calculationVersion`.

Financial values are canonical decimal strings, not JavaScript `number` values. `transactionDate` is the user-entered trade date; `createdAt` is the server timestamp used for audit ordering.

## Server-Owned Fields

Clients must not write `role`, `status`, aggregate balances, holdings projections, quote values, valuation snapshots, provider metadata, audit logs, or calculation versions. Security rules and trusted backend code enforce this restriction.
