# DECISIONS

Version: 1.0

---

# Purpose

This document records important architectural, technical, and business decisions made during the development of the project.

Every significant decision should be documented here.

This document serves as the project's Architectural Decision Record (ADR).

---

# Decision Template

```markdown
## ADR-XXX

Status

Accepted | Proposed | Deprecated | Replaced

Date

YYYY-MM-DD

Category

Architecture
Database
Backend
Frontend
UI/UX
Security
Performance
Business

Decision

...

Reason

...

Alternatives

...

Consequences

...
```

---

# ADR-001

Status

Accepted

Date

2026-08-05

Category

Frontend

## Decision

Use Nuxt 3 as the frontend framework.

## Reason

- Official Vue framework
- Excellent developer experience
- Built-in routing
- SSR support
- Static deployment support
- Strong ecosystem

## Alternatives

- Vue + Vite
- Next.js
- React
- Angular

## Consequences

Better scalability and maintainability.

---

# ADR-002

Status

Accepted

Date

2026-08-05

Category

UI

## Decision

Use PrimeVue as the primary UI Component Library.

## Reason

- Mature components
- Accessible
- Easy customization
- Excellent DataTable
- Good Nuxt support

## Alternatives

- Vuetify
- Quasar
- Naive UI
- Element Plus

## Consequences

Faster development with consistent UI.

---

# ADR-003

Status

Accepted

Date

2026-08-05

Category

Styling

## Decision

Use Tailwind CSS.

## Reason

- Utility-first
- Responsive
- Small bundle
- Easy maintenance

## Alternatives

- Bootstrap
- SCSS
- UnoCSS

## Consequences

Consistent layouts with minimal custom CSS.

---

# ADR-004

Status

Accepted

Date

2026-08-05

Category

State Management

## Decision

Use Pinia.

## Reason

- Official Vue state library
- Lightweight
- TypeScript friendly

## Alternatives

- Vuex
- Provide/Inject

## Consequences

Simpler global state management.

---

# ADR-005

Status

Accepted

Date

2026-08-05

Category

Backend

## Decision

Use Firebase.

## Services

- Authentication
- Firestore
- Storage
- Hosting

## Reason

- Free tier
- Fast development
- Serverless
- Good integration

## Alternatives

- Supabase
- Appwrite
- PocketBase

## Consequences

Rapid MVP development.

---

# ADR-006

Status

Accepted

Date

2026-08-05

Category

Architecture

## Decision

Use Clean Architecture.

## Reason

- Separation of concerns
- Testability
- Maintainability
- Scalability

## Consequences

Long-term maintainability.

---

# ADR-007

Status

Accepted

Date

2026-08-05

Category

Project Structure

## Decision

Use Feature-Based Folder Structure.

## Reason

Keeps related files together.

Improves scalability.

## Alternatives

Layer-based structure.

## Consequences

Better organization for growing projects.

---

# ADR-008

Status

Accepted

Date

2026-08-05

Category

Business Logic

## Decision

Business logic must live inside Services.

## Consequences

Components remain simple.

---

# ADR-009

Status

Accepted

Date

2026-08-05

Category

Repository

## Decision

Use Repository Pattern.

## Reason

Abstract Firebase and external APIs.

Allow provider replacement.

## Consequences

Low coupling.

---

# ADR-010

Status

Accepted

Date

2026-08-05

Category

Authentication

## Decision

Support

- Email Login
- Google Login

Email verification required only for Email registration.

## Consequences

Simple onboarding.

---

# ADR-011

Status

Accepted

Date

2026-08-05

Category

Portfolio

## Decision

Each user owns one immutable default portfolio.

Name

All Portfolio

Rules

- Auto-created
- Cannot rename
- Cannot delete
- Automatically aggregates every asset

---

# ADR-012

Status

Accepted

Date

2026-08-05

Category

Portfolio

## Decision

Maximum

10 portfolios

## Reason

Simple MVP limitation.

Can increase later.

---

# ADR-013

Status

Accepted

Date

2026-08-05

Category

Investment

## Decision

Users may purchase the same asset multiple times.

Transactions remain independent.

Holdings are aggregated automatically.

---

# ADR-014

Status

Accepted

Date

2026-08-05

Category

Investment

## Decision

Average Cost is the official cost basis.

## Alternatives

FIFO

LIFO

Specific Identification

## Reason

Matches expected user experience.

Simpler calculations.

---

# ADR-015

Status

Accepted

Date

2026-08-05

Category

Currency

## Decision

Support

USD

THB

Users may change display currency.

Exchange rate stored during transaction.

---

# ADR-016

Status

Accepted

Date

2026-08-05

Category

Market Data

## Decision

Use free market APIs.

Provider selected by development team.

Architecture allows changing providers.

---

# ADR-017

Status

Accepted

Date

2026-08-05

Category

Notifications

## Decision

Support only Notification Center.

Push notifications excluded from MVP.

Architecture prepared for future expansion.

---

# ADR-018

Status

Accepted

Date

2026-08-05

Category

Favorites

## Decision

Maximum

20 favorite assets.

---

# ADR-019

Status

Accepted

Date

2026-08-05

Category

Deployment

## Decision

Deploy on Firebase Hosting.

## Reason

Simple deployment.

Free tier.

Integrated ecosystem.

---

# ADR-020

Status

Accepted

Date

2026-08-05

Category

Business Scope

## Decision

This application is

NOT

a trading platform.

It is

only

an investment tracking application.

No broker integration.

No order placement.

No broker cash movement.

Users may record internal cash deposit and withdrawal tracking entries. These records do not call a broker, bank, payment service, or trading venue.

---

# ADR-021

Status

Accepted

Date

2026-08-05

Category

Charts

## Decision

Use TradingView Lightweight Charts as the primary charting library.

Fallback

Apache ECharts

## Reason

Fast

Lightweight

Financial chart focused

---

# ADR-022

Status

Accepted

Date

2026-08-05

Category

UI

## Decision

UI Inspiration

- Dime
- Apple
- Linear

Design Goals

- Modern
- Clean
- Minimal
- Responsive
- Easy to use

---

# ADR-023

Status

Accepted

Date

2026-08-05

Category

Theme

## Decision

Support

- Light
- Dark
- System

Theme preference stored per user.

---

# ADR-024

Status

Accepted

Date

2026-08-05

Category

Language

## Decision

Support

Thai

English

Internationalization must be implemented from the beginning.

---

# ADR-025

Status

Accepted

Date

2026-08-05

Category

AI Development

## Decision

AI Agents must follow

- AGENT_RULES.md
- PROJECT.md
- ARCHITECTURE.md
- CODING_STANDARDS.md

before generating any code.

AI must

- Analyze first
- Discuss first
- Ask questions when unclear
- Never assume requirements

---

# Future Decisions

---

# ADR-026

Status

Accepted

Date

2026-08-05

Category

Backend

## Decision

Use Firebase Hosting rewrites to Cloud Functions for trusted operations.

## Reason

Static hosting cannot keep market API keys secret or safely perform privileged administration and financial aggregate updates.

## Consequences

The project requires a Blaze billing account. Cost alerts, quotas, cache controls, and budget ownership are mandatory before production.

---

# ADR-027

Status

Accepted

Date

2026-08-05

Category

Database

## Decision

Treat `All Portfolio` as a virtual aggregate, not a persisted portfolio owner.

## Consequences

Assets and cash belong only to custom portfolios. Aggregate values are calculated from those portfolios and cannot be edited directly.

---

# ADR-028

Status

Accepted

Date

2026-08-05

Category

Business Logic

## Decision

Use immutable financial ledger events with reversal-based corrections.

## Consequences

The application maintains auditability and can safely rebuild holdings after a correction. Calculation details are owned by `CALCULATION_SPEC.md`.

---

# Future Decisions

Future ADRs should document

- Database changes
- API provider changes
- New technologies
- Breaking changes
- Security changes
- Performance optimizations
- Major UI redesigns
- Infrastructure changes

---

# Maintenance Policy

Every architectural change must update

- DECISIONS.md
- CHANGELOG.md
- PROJECT.md
- ARCHITECTURE.md (if applicable)
- DATABASE.md (if applicable)
- API.md (if applicable)

Documentation and implementation must always remain synchronized.
