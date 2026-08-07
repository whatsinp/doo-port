# ARCHITECTURE

Version: 1.0

---

# Overview

This project follows a modern, scalable, feature-based architecture using Clean Architecture principles.

The architecture is designed to:

- Scale easily
- Keep business logic independent
- Separate responsibilities
- Support future API replacements
- Support future backend migration
- Improve maintainability
- Improve testability

---

# Architecture Principles

Always follow

- Clean Architecture
- SOLID Principles
- Separation of Concerns
- Single Responsibility Principle
- Dependency Inversion
- Reusable Components
- Feature-based Architecture

---

# High-Level Architecture

```text
Presentation Layer

↓

Composable Layer

↓

Service Layer

↓

Repository Layer

↓

External Services

↓

Firebase / Market APIs
```

---

# Layer Responsibilities

## Presentation Layer

Contains

- Pages
- Layouts
- Components

Responsibilities

- Display UI
- Handle user interaction
- Emit events
- Receive data

Must NOT

- Call Firebase directly
- Call External APIs directly
- Calculate business logic

---

## Composable Layer

Contains reusable application logic.

Examples

```text
useAuth()

useDashboard()

usePortfolio()

useInvestment()

useMarket()

useFavorite()

useNotification()

useTheme()
```

Responsibilities

- UI Logic
- Form Logic
- State Coordination
- Error Handling
- Loading States

May call

- Services
- Pinia Stores

Must NOT

- Access Firebase directly

---

## Service Layer

Contains business logic.

Responsibilities

- Validation
- Calculations
- Workflow
- Business Rules

Examples

```text
AuthService

PortfolioService

InvestmentService

DashboardService

MarketService

CashService
```

Must NOT

Contain UI logic.

---

## Repository Layer

Acts as an abstraction layer.

Responsibilities

- Firebase
- External APIs
- Database Communication

Examples

```text
UserRepository

PortfolioRepository

InvestmentRepository

MarketRepository

NotificationRepository
```

Repositories should only communicate with

- Firebase
- REST APIs
- External Providers

---

## External Services

Examples

Firebase Authentication

Cloud Firestore

Firebase Storage

Market APIs

Exchange Rate APIs

Gold APIs

Repositories isolate these services from business logic.

---

# Feature-Based Architecture

The project is organized by feature rather than file type.

Example

```text
Portfolio

├── components
├── composables
├── services
├── repositories
├── types
└── utils
```

Every feature owns its own logic.

---

# Folder Structure

```text
app/

assets/

components/

composables/

layouts/

middleware/

pages/

plugins/

repositories/

services/

stores/

types/

utils/

server/

public/
```

---

# Component Architecture

Components should be

- Small
- Reusable
- Stateless whenever possible

Large components should be split.

Example

```text
Dashboard

↓

PortfolioSummaryCard

Today'sChangeCard

AllocationChart

PerformanceChart

TopGainerCard

TopLoserCard
```

---

# Composable Architecture

Composable files contain

- UI Logic
- Form Logic
- API Calls
- Error Handling

Example

```text
usePortfolio()

↓

PortfolioService

↓

PortfolioRepository
```

---

# Service Architecture

Services contain

Business Rules

Example

InvestmentService

Responsibilities

- Buy
- Sell
- Average Cost
- Profit Calculation

Services should never know how Firebase works.

---

# Repository Architecture

Repositories isolate data sources.

Example

```text
MarketRepository

↓

Finnhub API

↓

or

↓

Twelve Data API

↓

or

↓

Polygon API
```

The Service Layer never knows which provider is used.

---

# State Management

Pinia is the global state management solution.

Stores

```text
auth.store.ts

user.store.ts

portfolio.store.ts

market.store.ts

notification.store.ts

settings.store.ts
```

Stores should only contain

- Shared State
- Getters
- Actions

Business logic belongs inside Services.

---

# UI Architecture

Presentation only.

Pages

↓

Composable

↓

Store

↓

Service

↓

Repository

↓

Firebase/API

---

# Routing

Nuxt File-Based Routing.

Authentication middleware protects private routes.

Example

```text
/

login

register

dashboard

portfolio

market

favorites

notifications

profile

settings

admin
```

---

# Middleware

Examples

```text
auth

guest

admin
```

Responsibilities

- Authentication
- Authorization
- Redirect

---

# Plugin Architecture

Plugins initialize

Firebase

PrimeVue

Theme

Global Components

Global Directives

---

# Dependency Direction

Correct

```text
Component

↓

Composable

↓

Service

↓

Repository

↓

Firebase
```

Incorrect

```text
Component

↓

Firebase
```

Never bypass layers.

---

# Error Handling Flow

```text
API

↓

Repository

↓

Service

↓

Composable

↓

Component

↓

User
```

Each layer adds context without exposing implementation details.

---

# Validation Flow

Input

↓

Composable

↓

Service Validation

↓

Repository

↓

Database

Never trust client input.

---

# Authentication Flow

```text
Register

↓

Verify Email

↓

Login

↓

Create Session

↓

Load User

↓

Dashboard
```

---

# Portfolio Flow

```text
Portfolio

↓

Investment

↓

Transaction

↓

Dashboard

↓

Analytics
```

---

# Market Flow

```text
Search

↓

Market Repository

↓

External API

↓

Normalized Response

↓

Component
```

---

# Notification Flow

```text
Firestore

↓

Notification Repository

↓

Notification Service

↓

Composable

↓

Notification Center
```

---

# Design Patterns

Use

- Repository Pattern
- Service Pattern
- Dependency Injection (where appropriate)
- Composition Pattern
- Factory Pattern (if needed)

Avoid

- Singleton Business Logic
- God Components
- God Services

---

# Scalability

Architecture must support

- Multiple API Providers
- Future Premium Features
- Mobile Application
- Additional Asset Types
- Multi-language
- Multi-currency

without major refactoring.

---

# Performance

Use

- Lazy Loading
- Dynamic Imports
- Route Splitting
- Component Splitting
- Image Optimization

Avoid unnecessary rendering.

---

# Security

Never expose

- Firebase Admin SDK
- API Keys
- Private Tokens

Validate permissions at

- UI
- Service
- Firestore Rules

---

# Testing Strategy

Support

- Unit Tests
- Integration Tests
- End-to-End Tests

Business logic should be testable independently from Vue components.

---

# Architecture Rules

Always

- Keep layers independent
- Separate UI from business logic
- Separate business logic from data access
- Prefer composition over inheritance
- Build reusable modules
- Write maintainable code
- Design for future scalability

Never

- Put business logic inside components
- Access Firebase directly from UI
- Access APIs directly from pages
- Duplicate business logic
- Couple the application to a single API provider

---

# Domain Boundary

The financial domain is independent of Vue, Pinia, Firebase, and HTTP. It contains pure calculation policies, entities, and use cases for transaction validation, average cost, cash balances, valuation, and transfer validation.

`CALCULATION_SPEC.md` is the business source of truth. Services orchestrate use cases and repositories; composables coordinate UI state only. A composable must not own financial calculation rules or direct data-source access.

---

# Trusted Backend Boundary

Cloud Functions are part of the production architecture, not a future optional service. Firebase Hosting rewrites route trusted requests to those functions.

```text
Nuxt SPA
  -> Composable
  -> Application Service
  -> Repository or Trusted API Client
  -> Firestore / Storage / Cloud Function / Market Provider
```

Only trusted functions may update financial projections, valuation snapshots, market caches, custom claims, suspension status, and audit logs.
