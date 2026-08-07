# CODING_STANDARDS

Version: 1.0

---

# Purpose

This document defines the coding standards for the Investment Portfolio Tracker.

Every source file must follow these standards.

The primary goals are

- Readability
- Consistency
- Scalability
- Maintainability
- Testability

---

# General Principles

Always write code that is

- Simple
- Readable
- Predictable
- Reusable
- Maintainable
- Production Ready

Prefer

- Composition
- Small Functions
- Explicit Naming
- Strong Typing

Avoid

- Over Engineering
- Premature Optimization
- Duplicate Code
- Nested Logic
- Hardcoded Values

---

# Language

Use

- TypeScript

Do not use JavaScript unless absolutely necessary.

TypeScript Strict Mode must always be enabled.

---

# Vue Standards

Always use

- Vue 3
- Composition API
- `<script setup>`
- Auto Imports
- TypeScript

Never use

- Options API
- Mixins
- Vue Class Components

---

# Nuxt Standards

Use Nuxt conventions whenever possible.

Prefer

- Pages Router
- Server Routes
- Composables
- Plugins
- Middleware

Do not bypass Nuxt features without justification.

---

# File Naming

Use

PascalCase

for

- Vue Components

Example

```text
PortfolioCard.vue
DashboardSummary.vue
```

Use

camelCase

for

- composables
- services
- repositories
- utilities

Example

```text
usePortfolio.ts

portfolioService.ts

marketRepository.ts
```

Use

kebab-case

for

- folders

Example

```text
asset-detail

market-search

user-profile
```

---

# Folder Structure

Follow Feature-based Architecture.

Example

```text
features/

portfolio/

market/

dashboard/

authentication/

profile/
```

Each feature owns

- Components
- Types
- Services
- Repositories
- Composables
- Utils

---

# Import Rules

Import order

1. Vue
2. Nuxt
3. External Packages
4. Components
5. Composables
6. Services
7. Stores
8. Types
9. Utils

Separate each group with one empty line.

---

# Component Rules

Each component should

- Have one responsibility
- Be reusable
- Be easy to understand

Avoid components larger than

300 lines

Split into smaller components when necessary.

---

# Props

Always define

```typescript
interface Props {}
```

Example

```typescript
interface Props {
  title: string

  loading?: boolean
}
```

Never use

```typescript
any
```

---

# Emits

Always define emits explicitly.

Example

```typescript
const emit = defineEmits<{
  save: []

  cancel: []
}>()
```

---

# Composable Rules

Composable names

```text
useAuth

usePortfolio

useDashboard

useMarket

useTheme
```

Composable responsibilities

- Validation
- Loading State
- Error Handling

Composable responsibilities are UI-state coordination, form state, and presentation validation. Financial business logic belongs to domain use cases and application services. A composable does not call Firebase or a market provider directly.

Composable must not

- Render UI
- Manipulate DOM

---

# Service Rules

Services contain

Business Logic

Examples

```text
PortfolioService

InvestmentService

DashboardService
```

Services must not

- Know UI
- Access Components

Financial calculations must be pure, independently tested, and conform to `CALCULATION_SPEC.md`.

---

# Repository Rules

Repositories communicate with

- Firebase
- External APIs

Repositories should never

- Calculate business logic
- Update UI

---

# Pinia Rules

Stores contain

- Shared State
- Getters
- Actions

Stores should not contain

Complex business logic.

Business logic belongs inside Services.

---

# TypeScript Rules

Never use

```typescript
any
```

Prefer

```typescript
unknown
```

when type is uncertain.

Always define

- Interfaces
- Types
- Enums

Avoid implicit types.

---

# Interfaces

Prefer interfaces for objects.

Example

```typescript
interface User {
  id: string

  email: string
}
```

---

# Types

Use type aliases for

- Unions
- Utility Types

Example

```typescript
type Theme = 'light' | 'dark' | 'system'
```

---

# Enums

Prefer union types.

Avoid enums unless required.

---

# Functions

Keep functions

- Small
- Predictable
- Single Responsibility

Target

Less than

50 lines

---

# Async Code

Always use

```typescript
async

await
```

Avoid

Nested Promise Chains

Always handle

try

catch

---

# Error Handling

Every async function must handle

- Loading
- Error
- Success

Never ignore exceptions.

---

# Validation

Validate

- User Input
- API Response
- Firestore Data

Never trust external data.

---

# Naming Convention

Variables

camelCase

```typescript
portfolioValue

currentPrice

favoriteAssets
```

Functions

camelCase

```typescript
calculateProfit()

createPortfolio()

updateUser()
```

Classes

PascalCase

```typescript
PortfolioService

MarketRepository
```

Interfaces

PascalCase

```typescript
Portfolio

Investment

UserProfile
```

Constants

UPPER_SNAKE_CASE

```typescript
MAX_PORTFOLIOS

MAX_FAVORITES
```

---

# Magic Numbers

Never write

```typescript
if (favorites > 20)
```

Instead

```typescript
const MAX_FAVORITES = 20
```

---

# Hardcoded Strings

Avoid

```typescript
'Portfolio Created'
```

Prefer

```typescript
MESSAGE.PORTFOLIO_CREATED
```

or i18n resources.

---

# Comments

Write comments only when necessary.

Explain

Why

not

What

Bad

```typescript
// Increment counter

counter++
```

Good

```typescript
// Firebase requires a new transaction to prevent race conditions.
```

---

# PrimeVue Rules

Always use PrimeVue components before creating custom ones.

Examples

- Button
- Card
- Dialog
- Drawer
- DataTable
- ConfirmDialog
- Toast
- Avatar
- Skeleton
- AutoComplete

Customize with Tailwind only when necessary.

---

# Tailwind Rules

Tailwind is used for

- Layout
- Spacing
- Flex
- Grid
- Responsive
- Minor Styling

Avoid excessive utility chaining.

Extract repeated patterns into reusable components.

---

# Styling Rules

Do not use inline styles.

Use

- Tailwind
- PrimeVue Theme
- Scoped CSS only when necessary

---

# Firebase Rules

Never access Firebase directly from Components.

Always go through

Repository

↓

Service

↓

Composable

↓

Component

---

# API Rules

Never call APIs inside Components.

Use

Repository

↓

Service

↓

Composable

↓

UI

---

# Security

Never expose

- API Keys
- Secrets
- Tokens

Always validate

Authentication

Authorization

Input

---

# Performance

Use

- Lazy Loading
- Dynamic Imports
- Computed Properties
- Memoization when appropriate

Avoid unnecessary watchers.

---

# Accessibility

Support

- Keyboard Navigation
- Focus States
- Screen Readers
- ARIA Labels

---

# Responsive Design

Every page must support

- Desktop
- Tablet
- Mobile

Never design only for desktop.

---

# Git Commit Convention

Follow Conventional Commits.

Examples

```text
feat(portfolio): add portfolio sorting

fix(auth): resolve Google login issue

refactor(api): separate market repository

docs(database): update collection schema

test(investment): add average cost tests
```

---

# Code Review Checklist

Before submitting code

- TypeScript has no errors
- ESLint passes
- Formatting passes
- No duplicated code
- No unused imports
- No unused variables
- No console.log
- Proper error handling
- Responsive verified
- Dark mode verified
- Loading state implemented
- Empty state implemented
- Documentation updated

---

# Definition of Done

A task is complete only when

- Requirements implemented
- Code reviewed
- Tests passed
- Responsive verified
- Dark mode supported
- Loading state implemented
- Error handling completed
- Documentation updated
- Changelog updated
- Ready for production
