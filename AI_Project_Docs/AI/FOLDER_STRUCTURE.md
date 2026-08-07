# FOLDER_STRUCTURE

Version: 1.0

---

# Overview

This document defines the official folder structure for the Investment Portfolio Tracker.

The project follows

- Nuxt 3 conventions
- Feature-based Architecture
- Clean Architecture
- Scalable Folder Organization

Every new file should follow this structure.

---

# Root Structure

```text
project/

├── .github/
├── .nuxt/
├── .output/
├── app/
├── assets/
├── components/
├── composables/
├── layouts/
├── middleware/
├── pages/
├── plugins/
├── public/
├── repositories/
├── server/
├── services/
├── stores/
├── types/
├── utils/
├── docs/
├── firebase/
├── tests/
├── node_modules/

├── .env
├── .env.example
├── .gitignore
├── app.vue
├── nuxt.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── eslint.config.mjs
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
└── README.md
```

---

# app

Contains application entry configuration.

```text
app/

├── app.config.ts
└── app.vue
```

---

# assets

Static assets processed by Nuxt.

```text
assets/

├── css/
├── fonts/
├── icons/
└── images/
```

---

# components

Reusable UI Components.

```text
components/

├── common/

├── dashboard/

├── portfolio/

├── market/

├── investment/

├── favorites/

├── notifications/

├── profile/

├── settings/

├── admin/

└── charts/
```

Example

```text
components/dashboard/

PortfolioSummaryCard.vue

Today'sChangeCard.vue

AllocationChart.vue
```

---

# composables

Reusable Composition API logic.

```text
composables/

useAuth.ts

useDashboard.ts

usePortfolio.ts

useInvestment.ts

useMarket.ts

useFavorites.ts

useNotification.ts

useSettings.ts

useTheme.ts
```

---

# layouts

Application layouts.

```text
layouts/

default.vue

auth.vue

admin.vue
```

---

# middleware

Nuxt middleware.

```text
middleware/

auth.ts

guest.ts

admin.ts
```

---

# pages

Nuxt File-based Routing.

```text
pages/

index.vue

login.vue

register.vue

forgot-password.vue

dashboard.vue

market/

portfolio/

favorites/

notifications/

profile/

settings/

admin/
```

Example

```text
pages/

portfolio/

index.vue

[id].vue
```

---

# plugins

Application plugins.

```text
plugins/

firebase.client.ts

primevue.ts

i18n.ts

echarts.client.ts

dayjs.ts
```

---

# repositories

Data access layer.

```text
repositories/

authRepository.ts

userRepository.ts

portfolioRepository.ts

investmentRepository.ts

marketRepository.ts

favoriteRepository.ts

notificationRepository.ts

settingsRepository.ts
```

Repositories communicate only with

- Firebase
- External APIs

---

# server

Nuxt server routes.

```text
server/

api/

utils/

middleware/
```

Future use

- Secure API Proxy
- API Key Protection
- Backend Utilities

---

# services

Business Logic Layer.

```text
services/

authService.ts

dashboardService.ts

portfolioService.ts

investmentService.ts

marketService.ts

favoriteService.ts

notificationService.ts

settingsService.ts
```

---

# stores

Pinia Stores.

```text
stores/

auth.store.ts

user.store.ts

portfolio.store.ts

market.store.ts

notification.store.ts

settings.store.ts
```

---

# types

Global TypeScript types.

```text
types/

auth.ts

user.ts

portfolio.ts

investment.ts

market.ts

favorite.ts

notification.ts

settings.ts

api.ts
```

---

# utils

Pure helper functions.

```text
utils/

currency.ts

date.ts

format.ts

math.ts

validation.ts

constants.ts

helpers.ts
```

Utilities must never access

- Firebase
- Pinia
- Vue Components

---

# public

Public static files.

```text
public/

favicon.ico

robots.txt

manifest.json

icons/

images/
```

---

# firebase

Firebase configuration.

```text
firebase/

firebase.ts

auth.ts

firestore.ts

storage.ts
```

Only Repository files should import these modules.

---

# docs

Project documentation.

```text
docs/

AGENT_RULES.md

PROJECT.md

FEATURES.md

API.md

ARCHITECTURE.md

DATABASE.md

DECISIONS.md

DEPLOYMENT.md

DEVELOPMENT_WORKFLOW.md

FIREBASE.md

FOLDER_STRUCTURE.md

SECURITY.md

TECH_STACK.md

UI_UX.md

ROADMAP.md

CHANGELOG.md

CODING_STANDARDS.md
```

---

# tests

Testing.

```text
tests/

unit/

integration/

e2e/
```

---

# GitHub

```text
.github/

workflows/

ISSUE_TEMPLATE/

PULL_REQUEST_TEMPLATE.md
```

---

# Feature Organization

Large features may contain their own internal folders.

Example

```text
components/

portfolio/

cards/

dialogs/

tables/

charts/

forms/
```

---

# Naming Convention

Folders

```text
kebab-case
```

Components

```text
PascalCase.vue
```

Composable

```text
useSomething.ts
```

Repository

```text
somethingRepository.ts
```

Service

```text
somethingService.ts
```

Store

```text
something.store.ts
```

Types

```text
something.ts
```

Utilities

```text
something.ts
```

---

# Import Direction

Always

```text
Page

↓

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

Never

```text
Component

↓

Firebase
```

---

# Module Ownership

Each layer owns different responsibilities.

Components

- UI

Composable

- UI Logic

Service

- Business Logic

Repository

- Data Access

Firebase

- Infrastructure

---

# Future Expansion

Recommended future folders

```text
modules/

hooks/

workers/

scripts/

migrations/

emails/

functions/

analytics/
```

Architecture should support adding them without restructuring the existing project.

---

# Forbidden Structure

Avoid

```text
components/

component1.vue

component2.vue

component3.vue

component4.vue
```

Instead

```text
components/

dashboard/

portfolio/

market/

profile/
```

Organize by feature, not by file type.

---

# Folder Rules

Every folder should have a clear responsibility.

Avoid

- Misc folders
- Temp folders
- Random utility files

When a folder grows too large

Split it by feature.

---

# Architecture Summary

```text
pages

↓

components

↓

composables

↓

services

↓

repositories

↓

firebase

↓

Firestore / External APIs
```

Every new feature must follow this dependency flow.

No layer may bypass the one below it.

---

# Authoritative Feature Structure

The project uses feature ownership. The earlier top-level layer folders are shared infrastructure only; they must not become a second location for feature business logic.

```text
app/
  features/
    portfolio/
      components/
      composables/
      application/
      domain/
      infrastructure/
      types/
    investment/
    market/
    dashboard/
    admin/
  shared/
    components/
    domain/
    infrastructure/
    types/
    utils/
  server/
    api/
    functions/
```

`domain/` contains pure entities, policies, and use cases. `application/` coordinates domain logic and ports. `infrastructure/` contains Firebase and provider implementations. Vue pages and components never import infrastructure directly.

Use one Nuxt application entry point only. Do not create both root `app.vue` and `app/app.vue`.
